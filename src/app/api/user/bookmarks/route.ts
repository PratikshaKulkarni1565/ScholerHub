import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { scholarshipId } = await req.json();
    const user = await User.findOne({ email: session.user.email });

    const isBookmarked = user.bookmarks.includes(scholarshipId);
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id: string) => id.toString() !== scholarshipId
      );
    } else {
      user.bookmarks.push(scholarshipId);
    }

    await user.save();
    return NextResponse.json({ bookmarked: !isBookmarked });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
