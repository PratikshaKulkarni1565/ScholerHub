import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const [totalScholarships, totalUsers, featured, expiringSoon] = await Promise.all([
      Scholarship.countDocuments(),
      User.countDocuments({ role: "user" }),
      Scholarship.countDocuments({ featured: true }),
      Scholarship.countDocuments({
        deadline: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    return NextResponse.json({ totalScholarships, totalUsers, featured, expiringSoon });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
