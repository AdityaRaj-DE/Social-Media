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
    const { id: postId } = await context.params; // ✅ FIX

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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

    const userId = user._id.toString();
    const alreadyLiked = post.likes.some(
      (id: any) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id: any) => id.toString() !== userId
      );
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    return NextResponse.json({
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
