import Image from "next/image";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import PostCard from "@/components/PostCard";
import { Types } from "mongoose";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  await connectDB();

  if (!Types.ObjectId.isValid(params.id)) {
    throw new Error("Invalid user id");
  }
  
  // 1️⃣ Find profile owner
  const userDoc = await User.findById(params.id).lean();
  if (!userDoc) {
    return (
      <div className="p-6 text-center text-gray-600">
        User not found
      </div>
    );
  }
  

  const profileUser = {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    profilePic:
      userDoc.profilePic?.startsWith("http")
        ? userDoc.profilePic
        : "/default-avatar.png",
  };

  // 2️⃣ Fetch that user's posts
  const rawPosts = await Post.find({ user: profileUser.id })
    .populate("user", "_id name profilePic")
    .sort({ createdAt: -1 })
    .lean();

  // 3️⃣ Sanitize posts
  const posts = rawPosts.map((post: any) => ({
    id: post._id.toString(),
    content: post.content || "",
    imageUrl: post.imageUrl || "",
    likes: post.likes?.map((id: any) => id.toString()) || [],
    createdAt: post.createdAt?.toISOString(),

    isOwner: post.user?._id.toString() === currentUser._id.toString(),

    user: post.user
      ? {
          id: post.user._id.toString(),
          name: post.user.name,
          profilePic:
            post.user.profilePic?.startsWith("http")
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
            src={profileUser.profilePic}
            alt=""
            width={100}
            height={100}
            className="rounded-full"
          />

          <div>
            <h1 className="text-xl font-semibold">{profileUser.name}</h1>
            <p className="text-sm text-gray-600">{profileUser.email}</p>
          </div>
        </div>

        {/* User Posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Posts</h2>

          {posts.length === 0 && (
            <p className="text-gray-500">
              This user hasn’t posted anything yet.
            </p>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUser._id.toString()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
