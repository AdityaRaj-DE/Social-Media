import { connectDB } from "../../../lib/db";
import Post from "../../../models/Post";
import { getCurrentUser } from "../../../lib/auth";

export async function GET() {
  await connectDB();

  const posts = await Post.find()
    .populate("user", "username name profilePic")
    .sort({ createdAt: -1 });

  return Response.json(posts);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, imageUrl } = await req.json();

  await connectDB();

  const post = await Post.create({
    user: user._id,
    content,
    imageUrl,
  });

  return Response.json(post, { status: 201 });
}
