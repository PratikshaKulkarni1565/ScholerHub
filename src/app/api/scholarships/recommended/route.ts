import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Scholarship } from "@/models/Scholarship";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";
import { getRecommended } from "@/lib/recommend";
import { IScholarship, IUser } from "@/types";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const [user, scholarships] = await Promise.all([
      User.findOne({ email: session.user.email }).lean() as Promise<IUser>,
      Scholarship.find({ deadline: { $gte: new Date() } }).lean() as Promise<IScholarship[]>
    ]);

    if (!user) return NextResponse.json({ recommendations: [] });

    const recommendations = getRecommended(user, scholarships, 6);
    return NextResponse.json({ recommendations: JSON.parse(JSON.stringify(recommendations)) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
