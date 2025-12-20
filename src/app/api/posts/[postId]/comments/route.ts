import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { Types } from "mongoose";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Comment text required" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "Invalid post id" },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    post.comments.push({
      user: user._id,
      text,
    });

    await post.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
