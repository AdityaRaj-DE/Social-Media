"use client";

import { useState } from "react";

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (loading) return;

    setLoading(true);

    // Optimistic UI update
    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Like failed");
      }
    } catch {
      // Rollback on failure
      setLiked(liked);
      setCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-2 text-sm ${
        liked ? "text-red-500" : "text-gray-500"
      }`}
    >
      {liked ? "❤️" : "🤍"} {count}
    </button>
  );
}
