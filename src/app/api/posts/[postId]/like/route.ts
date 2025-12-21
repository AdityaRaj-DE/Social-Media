import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { Types } from "mongoose";

export async function POST(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params; // 🔥 THIS IS THE FIX

  if (!Types.ObjectId.isValid(postId)) {
    return Response.json({ error: "Invalid post id" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const post = await Post.findById(postId);
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const userId = user._id.toString();

  const alreadyLiked = post.likes
    .map((id: any) => id.toString())
    .includes(userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (id: any) => id.toString() !== userId
    );
  } else {
    post.likes.push(user._id);
  }

  await post.save();

  return Response.json({
    liked: !alreadyLiked,
    likesCount: post.likes.length,
  });
}
