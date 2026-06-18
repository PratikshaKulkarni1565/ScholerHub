import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { auth } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const scholarship = await Scholarship.findById(id).lean();
    if (!scholarship)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(scholarship);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const updated = await Scholarship.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    await Scholarship.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
