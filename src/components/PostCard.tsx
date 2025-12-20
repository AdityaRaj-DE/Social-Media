"use client";

import Link from "next/link";
import Image from "next/image";
import LikeButton from "./LikeButton";
import Comments from "./Comments";

export default function PostCard({
  post,
  currentUserId,
}: {
  post: any;
  currentUserId: string;
}) {
  const isOwner = post.isOwner;




  const deletePost = async () => {
    const confirmDelete = confirm("Delete this post?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/posts/${post.id}`, {
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

      {post.user && (
        <Link
          href={
            post.user.id === currentUserId
              ? "/profile"
              : `/user/${post.user.id}`
          }
          className="font-semibold hover:underline"
        >

          {post.user.name}
        </Link>
      )}


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
        postId={post.id}
        initialLiked={likedByUser}
        initialCount={post.likes.length}
      />
      <Comments postId={post.id} comments={post.comments} />
    </div>
  );
}
