import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findOne({ email: session.user.email })
      .populate("bookmarks")
      .lean();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { profile: body.profile, name: body.name },
      { new: true }
    );
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
