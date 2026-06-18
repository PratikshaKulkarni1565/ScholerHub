import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { openai } from "@/lib/openai";

const SYSTEM_PROMPT = `You are a scholarship search assistant for Indian students.
Extract search filters from the user's natural language query and return ONLY a valid JSON object with these optional fields:
{
  "educationLevel": "School|Diploma|UG|PG",
  "category": "Government|State Government|Private|International",
  "location": "India|Abroad|Both",
  "fieldOfStudy": "Engineering|Medical|Arts|Science|Commerce|Law",
  "state": "state name",
  "keyword": "any keyword for text search"
}
Only include fields that are clearly mentioned. Return raw JSON only, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

    // Use AI to parse natural language into filters
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      temperature: 0,
      max_tokens: 200
    });

    const raw = aiResponse.choices[0].message.content || "{}";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let filters: any = {};
    try {
      filters = JSON.parse(raw);
    } catch {
      filters = {};
    }

    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mongoQuery: any = { deadline: { $gte: new Date() } };

    if (filters.keyword) mongoQuery.$text = { $search: filters.keyword };
    if (filters.educationLevel) mongoQuery["eligibility.educationLevel"] = filters.educationLevel;
    if (filters.category) mongoQuery.category = filters.category;
    if (filters.location) mongoQuery.location = filters.location;
    if (filters.fieldOfStudy) mongoQuery["eligibility.fieldOfStudy"] = filters.fieldOfStudy;
    if (filters.state) mongoQuery["eligibility.states"] = { $in: [filters.state, "All India"] };

    const scholarships = await Scholarship.find(mongoQuery).sort({ deadline: 1 }).limit(12).lean();

    return NextResponse.json({ scholarships: JSON.parse(JSON.stringify(scholarships)), filters });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("API key") || msg.includes("401") || msg.includes("invalid")) {
      return NextResponse.json({ scholarships: [], error: "AI service unavailable" });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
