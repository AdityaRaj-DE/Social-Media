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
    <div className="glass rounded-card p-4 space-y-3 relative">
      {/* Owner action */}
      {isOwner && (
        <button
          onClick={deletePost}
          className="absolute top-3 right-3 text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      )}
  
      {/* Author */}
      {post.user && (
        <Link
          href={
            post.user.id === currentUserId
              ? "/profile"
              : `/user/${post.user.id}`
          }
          className="text-sm font-semibold hover:underline"
        >
          {post.user.name}
        </Link>
      )}
  
      {/* Content */}
      {post.content && (
        <p className="text-sm leading-relaxed text-text">
          {post.content}
        </p>
      )}
  
      {/* Image */}
      {post.imageUrl?.startsWith("http") && (
        <Image
          src={post.imageUrl}
          alt=""
          width={600}
          height={600}
          className="rounded-lg mt-2"
        />
      )}
  
      {/* Actions */}
      <div className="flex items-center gap-6 pt-2">
        <LikeButton
          postId={post.id}
          initialLiked={likedByUser}
          initialCount={post.likes.length}
        />
      </div>
  
      {/* Comments */}
      <Comments postId={post.id} comments={post.comments} />
    </div>
  );  
}
