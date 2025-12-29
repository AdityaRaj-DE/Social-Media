import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // 🔥 MUST await params in App Router
    const { id: userId } = await context.params;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch ONLY this user's posts
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name profilePic");

    return NextResponse.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
