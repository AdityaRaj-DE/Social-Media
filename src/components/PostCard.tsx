"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import { timeAgo } from "@/utils/timeAgo";
import Modal from "./Modal";

export default function PostCard({
  post,
  currentUserId,
}: {
  post: any;
  currentUserId: string;
}) {
  const [showComments, setShowComments] = useState(false);

  const [commentsCount, setCommentsCount] = useState<number>(
    Array.isArray(post.comments)
      ? post.comments.length
      : post.commentsCount ?? 0
  );
  


  const likedByUser =
    Array.isArray(post.likes) && currentUserId
      ? post.likes.includes(currentUserId)
      : false;

  return (
    <div className="bg-white dark:bg-black rounded-card p-4 space-y-3">
      {/* HEADER */}
      <div className="flex text-black dark:text-white items-center justify-between">
        <Link
          href={
            post.user.id === currentUserId
              ? "/profile"
              : `/user/${post.user.id}`
          }
          className="flex items-center gap-3"
        >
          <Image
            src={post.user.profilePic}
            alt={post.user.name}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-black dark:text-white">
              {post.user.name}
            </span>
            <span className="text-xs text-black dark:text-white">
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </Link>
      </div>

      {/* CONTENT */}
      {post.content && (
        <p className="text-sm leading-relaxed text-black dark:text-white">
          {post.content}
        </p>
      )}

      {/* IMAGE */}
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt=""
          width={600}
          height={600}
          className="rounded-lg w-full object-cover"
        />
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-6 pt-2">
        <LikeButton
          postId={post.id}
          initialLiked={likedByUser}
          initialCount={post.likes.length}
        />

        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1 text-sm text-black dark:text-white hover:text-black dark:text-white transition"
        >
          💬
          <span>{commentsCount}</span>
        </button>
      </div>

      {/* SECONDARY COUNTS */}
      {(post.likes.length > 0 || commentsCount > 0) && (
        <div className="text-xs text-black dark:text-white flex gap-4">
          {post.likes.length > 0 && (
            <span>{post.likes.length} likes</span>
          )}
          {commentsCount > 0 && (
            <span>{commentsCount} comments</span>
          )}
        </div>
      )}

      {/* COMMENTS MODAL (ONLY PLACE COMMENTS EXIST) */}
      <Modal
        open={showComments}
        onClose={() => setShowComments(false)}
      >
        <div className="flex flex-col h-full">
          {/* Comments list */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <Comments
              postId={post.id}
              currentUserId={currentUserId}
              onNewComment={() =>
                setCommentsCount((c) => c + 1)
              }
              onDeleteComment={() =>
                setCommentsCount((c) => c - 1)
              }
            />
          </div>
        </div>
      </Modal>


    </div>
  );
}
