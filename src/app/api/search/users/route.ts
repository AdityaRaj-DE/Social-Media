import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  await connectDB();

  const users = await User.find(
    { $text: { $search: q } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(10)
    .lean();

  const result = users.map((u: any) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    profilePic:
      u.profilePic?.startsWith("http")
        ? u.profilePic
        : "/default-avatar.png",
  }));

  return NextResponse.json(result);
}
