import Image from "next/image";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

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
    <div className="min-h-screen bg-bg text-text px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="glass rounded-card p-6 flex items-center gap-6">
          <Image
            src={profileImage || "/avatar-placeholder.png"}
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full object-cover"
          />

          <div className="flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted">{user.email}</p>
            <p className="text-sm text-muted">Age: {user.age}</p>

            <Link
              href="/profile/edit"
              className="
              inline-block mt-3
              text-sm font-medium
              text-accent
              hover:underline
            "
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* User Posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Posts</h2>

          {posts.length === 0 && (
            <p className="text-sm text-muted">
              You haven’t posted anything yet.
            </p>
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
