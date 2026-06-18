import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    const search = searchParams.get("search");
    if (search) query.$text = { $search: search };

    const educationLevel = searchParams.get("educationLevel");
    if (educationLevel) query["eligibility.educationLevel"] = educationLevel;

    const category = searchParams.get("category");
    if (category) query.category = category;

    const location = searchParams.get("location");
    if (location) query.location = location;

    const fieldOfStudy = searchParams.get("fieldOfStudy");
    if (fieldOfStudy) query["eligibility.fieldOfStudy"] = fieldOfStudy;

    const deadline = searchParams.get("deadline");
    if (deadline === "upcoming") query.deadline = { $gte: new Date() };

    const featured = searchParams.get("featured");
    if (featured === "true") query.featured = true;

    const [scholarships, total] = await Promise.all([
      Scholarship.find(query).sort({ deadline: 1 }).skip(skip).limit(limit).lean(),
      Scholarship.countDocuments(query)
    ]);

    return NextResponse.json({ scholarships, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const scholarship = await Scholarship.create(body);
    return NextResponse.json(scholarship, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
