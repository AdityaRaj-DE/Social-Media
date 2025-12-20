import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";

import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import ProfileCard from "@/components/ProfileCard";

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
const rawPosts = await Post.find()
  .populate("user", "name profilePic")
  .populate("comments.user", "_id name profilePic")
  .sort({ createdAt: -1 })
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
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto grid grid-cols-12 gap-6 p-6">
        <aside className="col-span-3 hidden md:block">
          <ProfileCard user={user} />
        </aside>

        <section className="col-span-12 md:col-span-6 space-y-4">
          {posts.length === 0 && (
            <p className="text-center text-gray-500">
              No posts yet
            </p>
          )}

          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user.id}
            />
          ))}

        </section>

        <aside className="col-span-3 hidden md:block">
          <div className="border rounded p-4 bg-white text-sm text-gray-500">
            Suggestions / Ads
          </div>
        </aside>
      </main>
    </div>
  );
}
