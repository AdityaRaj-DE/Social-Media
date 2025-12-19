"use client";

import Image from "next/image";
import LikeButton from "./LikeButton";

export default function PostCard({
  post,
  currentUserId,
}: {
  post: any;
  currentUserId: string;
}) {
  const isOwner = post.user?._id === currentUserId;

  const deletePost = async () => {
    const confirmDelete = confirm("Delete this post?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/posts/${post._id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete post");
      return;
    }

    // simplest reliable update
    window.location.reload();
  };

  const likedByUser = post.likes.includes(currentUserId);

  return (
    <div className="border rounded p-4 space-y-2 bg-white relative">
      {/* Owner actions */}
      {isOwner && (
        <button
          onClick={deletePost}
          className="absolute top-2 right-2 text-xs text-red-500"
        >
          Delete
        </button>
      )}

      <div className="font-semibold">{post.user?.name}</div>

      {post.content && (
        <p className="text-sm text-gray-800">{post.content}</p>
      )}

      {post.imageUrl?.startsWith("http") && (
        <Image
          src={post.imageUrl}
          alt=""
          width={400}
          height={400}
          className="rounded"
        />
      )}

      <LikeButton
        postId={post._id}
        initialLiked={likedByUser}
        initialCount={post.likes?.length || 0}
      />
    </div>
  );
}
