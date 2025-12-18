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

  const posts = await Post.find()
    .populate("user", "name profilePic")
    .sort({ createdAt: -1 })
    .lean(); // 👈 already plain objects

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
            <PostCard key={post._id.toString()} post={post} />
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
