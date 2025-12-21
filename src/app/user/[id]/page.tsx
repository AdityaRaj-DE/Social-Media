import Image from "next/image";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import PostCard from "@/components/PostCard";
import { Types } from "mongoose";
import FollowButton from "@/components/FollowButton";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user id");
  }


  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  await connectDB();


  // 1️⃣ Find profile owner
  const userDoc = await User.findById(id).lean();
  if (!userDoc) {
    return (
      <div className="p-6 text-center text-gray-600">
        User not found
      </div>
    );
  }
  const user = {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    age: userDoc.age,
    profilePic: userDoc.profilePic,
    followers: Array.isArray(userDoc.followers) ? userDoc.followers : [],
    following: Array.isArray(userDoc.following) ? userDoc.following : [],
  };
  
  

  const isFollowing = user.followers
    .map((id: any) => id.toString())
    .includes(currentUser._id.toString());
    const profileUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePic:
        user.profilePic?.startsWith("http")
          ? user.profilePic
          : "/default-avatar.png",
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing,
    };
    


  // 2️⃣ Fetch that user's posts
  const rawPosts = await Post.find({ user: id })
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
        {currentUser._id.toString() !== profileUser.id && (
          <FollowButton
            userId={profileUser.id}
            initialFollowing={profileUser.isFollowing}
          />
        )}


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
