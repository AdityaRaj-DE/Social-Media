import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";

import Feed from "@/components/Feed";
import MobileShell from "@/components/MobileShell";

export default async function HomePage() {
  const userDoc = await getCurrentUser();
  if (!userDoc) {
    throw new Error("Unauthorized");
  }

  // 🔥 CONVERT MONGOOSE DOC → PLAIN OBJECT
  const user = {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    age: userDoc.age,
    profilePic: userDoc.profilePic,
  };

  await connectDB();
  const PAGE_SIZE = 10;

const rawPosts = await Post.find()
  .sort({ createdAt: -1 })
  .limit(PAGE_SIZE)
  .populate("user", "name profilePic")
  .lean();


  const posts = rawPosts.map((post: any) => ({
    id: post._id.toString(),
    content: post.content || "",
    imageUrl: post.imageUrl || "",
    likes: post.likes?.map((id: any) => id.toString()) || [],
    createdAt: post.createdAt?.toISOString(),
    isOwner: post.user?._id.toString() === user.id,
    user: post.user
      ? {
        id: post.user._id.toString(),
        name: post.user.name,
        profilePic:
          post.user.profilePic &&
            post.user.profilePic.startsWith("http")
            ? post.user.profilePic
            : "/default-avatar.png",
      }
      : null,
    comments:
      post.comments?.map((c: any) => ({
        id: c._id.toString(),
        text: c.text,
        createdAt: c.createdAt?.toISOString(),
        isOwner: c.user?._id.toString() === user.id,
        user: {
          id: c.user._id.toString(),
          name: c.user.name,
          profilePic:
            c.user.profilePic?.startsWith("http")
              ? c.user.profilePic
              : "/default-avatar.png",
        },
      })) || [],
  }));


  return (
    <MobileShell>

    <main className="max-w-6xl mx-auto px-4 py-4">
      <Feed initialPosts={posts} currentUserId={user.id} />
    </main>
    </MobileShell>
  );
}
