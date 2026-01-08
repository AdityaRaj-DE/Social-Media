"use client";


import { Heart } from "lucide-react";
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

    // 🔥 optimistic update
    const prevLiked = liked;
    const prevCount = count;

    setLiked(!prevLiked);
    setCount(prevLiked ? count - 1 : count + 1);
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Like failed");
      }
    } catch (e) {
      // ❌ rollback
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-1 text-sm text-black dark:text-white transition
        ${liked ? "text-black dark:text-white" : "text-muted hover:text-text"}
      `}
    >
      <Heart
        size={18}
        className={liked ? "fill-current" : ""}
      /> <span>{count}</span>
    </button>
  );
}
