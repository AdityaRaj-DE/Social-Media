import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { Types } from "mongoose";

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ postId: string; commentId: string }>;
  }
) {
  try {
    // ✅ UNWRAP PARAMS
    const { postId, commentId } = await context.params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(commentId)
    ) {
      return NextResponse.json(
        { error: "Invalid id" },
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

    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // 🔐 OWNERSHIP CHECK
    if (comment.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    comment.deleteOne();
    await post.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
