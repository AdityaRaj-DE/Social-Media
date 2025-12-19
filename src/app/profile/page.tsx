import Image from "next/image";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";

import PostCard from "@/components/PostCard";

export default async function ProfilePage() {
  const userDoc = await getCurrentUser();
  if (!userDoc) {
    throw new Error("Unauthorized");
  }

 

  // 🔒 sanitize user
  const user = {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    age: userDoc.age,
    profilePic: userDoc.profilePic,
  };

  await connectDB();
  const profileImage = user.profilePic && user.profilePic.startsWith("http") ? user.profilePic : "/default-avatar.svg";

  const rawPosts = await Post.find({ user: user.id })
  .populate("user", "_id name profilePic")
  .sort({ createdAt: -1 })
  .lean();

const posts = rawPosts.map((post: any) => ({
  id: post._id.toString(),
  content: post.content || "",
  imageUrl: post.imageUrl || "",
  likes: post.likes?.map((id: any) => id.toString()) || [],
  createdAt: post.createdAt?.toISOString(),

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
}));


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white p-6 rounded flex items-center gap-6">
          <Image
              src={profileImage}
            alt=""
            width={100}
            height={100}
            className="rounded-full"
          />

          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">Age: {user.age}</p>

            <a
              href="/profile/edit"
              className="inline-block mt-2 text-sm underline"
            >
              Edit Profile
            </a>
          </div>
        </div>

        {/* User Posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Posts</h2>

          {posts.length === 0 && (
            <p className="text-gray-500">You haven’t posted anything yet.</p>
          )}

          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
