import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await req.json();
    await Scholarship.insertMany(data);
    return NextResponse.json({ message: `${data.length} scholarships seeded` });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
