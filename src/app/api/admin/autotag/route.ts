import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";

const SYSTEM_PROMPT = `You are a scholarship data assistant. Given a scholarship title and description, extract and return ONLY a valid JSON object:
{
  "category": "Government|State Government|Private|International",
  "location": "India|Abroad|Both",
  "eligibility": {
    "educationLevel": ["School"|"Diploma"|"UG"|"PG"],
    "fieldOfStudy": ["Engineering"|"Medical"|"Arts"|"Science"|"Commerce"|"Law"|"All"],
    "states": ["state name or All India"]
  }
}
Return raw JSON only. Be accurate based on the scholarship content.`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description } = await req.json();
    if (!title || !description)
      return NextResponse.json({ error: "Title and description required" }, { status: 400 });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Title: ${title}\nDescription: ${description}` }
      ],
      temperature: 0,
      max_tokens: 300
    });

    const raw = response.choices[0].message.content || "{}";
    let tags = {};
    try {
      tags = JSON.parse(raw);
    } catch {
      tags = {};
    }

    return NextResponse.json({ tags });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("API key") || msg.includes("401") || msg.includes("invalid")) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}