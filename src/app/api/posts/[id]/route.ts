import { connectDB } from "../../../../lib/db";
import Post from "../../../../models/Post";
import { getCurrentUser } from "../../../../lib/auth";

export async function DELETE(
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

  if (post.user.toString() !== user._id.toString()) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await post.deleteOne();

  return Response.json({ success: true });
}
