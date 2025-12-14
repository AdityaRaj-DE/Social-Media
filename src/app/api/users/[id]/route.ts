import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import Post from "../../../../models/Post";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const user = await User.findById(params.id).select("-password");
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 });

  return Response.json({ user, posts });
}
