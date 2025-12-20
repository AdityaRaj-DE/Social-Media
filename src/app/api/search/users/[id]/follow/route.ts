import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetUserId } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentUser._id.toString() === targetUserId) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 }
    );
  }

  await connectDB();

  const me = await User.findById(currentUser._id);
  const target = await User.findById(targetUserId);

  if (!me || !target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isFollowing = me.following.includes(target._id);

  if (isFollowing) {
    // UNFOLLOW
    me.following.pull(target._id);
    target.followers.pull(me._id);
  } else {
    // FOLLOW
    me.following.push(target._id);
    target.followers.push(me._id);
  }

  await me.save();
  await target.save();

  return NextResponse.json({
    following: !isFollowing,
    followersCount: target.followers.length,
  });
}
