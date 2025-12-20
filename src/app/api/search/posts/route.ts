import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const cursor = searchParams.get("cursor");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ posts: [], nextCursor: null });
  }

  await connectDB();

  const query: any = { $text: { $search: q } };
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const rawPosts = await Post.find(query)
    .populate("user", "_id name profilePic")
    .sort({ _id: -1 })
    .limit(10)
    .lean();

  const posts = rawPosts.map((post: any) => ({
    id: post._id.toString(),
    content: post.content,
    imageUrl: post.imageUrl || "",
    user: {
      id: post.user._id.toString(),
      name: post.user.name,
      profilePic:
        post.user.profilePic?.startsWith("http")
          ? post.user.profilePic
          : "/default-avatar.png",
    },
  }));

  const nextCursor =
    posts.length === 10 ? posts[posts.length - 1].id : null;

  return NextResponse.json({ posts, nextCursor });
}
