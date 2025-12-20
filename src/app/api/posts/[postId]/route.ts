import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { Types } from "mongoose";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1️⃣ Get post id
    const { id: postId } = await context.params;

    if (!Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "Invalid post id" },
        { status: 400 }
      );
    }

    // 2️⃣ Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ DB connect
    await connectDB();

    // 4️⃣ Find post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // 5️⃣ OWNERSHIP CHECK (CRITICAL)
    if (post.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 6️⃣ Delete post
    await post.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
