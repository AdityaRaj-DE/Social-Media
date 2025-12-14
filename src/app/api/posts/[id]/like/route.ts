import { connectDB } from "../../../../../lib/db";
import Post from "../../../../../models/Post";
import { getCurrentUser } from "../../../../../lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const post = await Post.findById(params.id);
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const liked = post.likes.includes(user._id);

  if (liked) {
    post.likes.pull(user._id);
  } else {
    post.likes.push(user._id);
  }

  await post.save();

  return Response.json({
    liked: !liked,
    likesCount: post.likes.length,
  });
}
