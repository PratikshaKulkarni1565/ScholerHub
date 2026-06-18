import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages?.length) return NextResponse.json({ error: "Messages required" }, { status: 400 });

    const session = await auth();
    await connectDB();

    // Fetch top 20 active scholarships as context
    const scholarships = await Scholarship.find({ deadline: { $gte: new Date() } })
      .sort({ deadline: 1 })
      .limit(20)
      .select("title description eligibility amount deadline category provider")
      .lean();

    // Optionally include user profile for personalized answers
    let userContext = "";
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).lean();
      if (user?.profile) {
        userContext = `\nThe user's profile: Education: ${user.profile.educationLevel}, Field: ${user.profile.fieldOfStudy}, State: ${user.profile.state}.`;
      }
    }

    const systemPrompt = `You are ScholarBot, a helpful scholarship assistant for Indian students on ScholarHub.
Answer questions about scholarships, eligibility, deadlines, and application tips.
Be concise, friendly, and helpful. Use bullet points when listing scholarships.${userContext}

Available scholarships data:
${JSON.stringify(scholarships, null, 2)}

If asked about eligibility, check the user's profile against scholarship requirements.
If no scholarships match, suggest the user update their profile or browse all scholarships.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("API key") || msg.includes("401") || msg.includes("invalid")) {
      return NextResponse.json({ reply: "AI assistant is currently unavailable. Please check back later." });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
