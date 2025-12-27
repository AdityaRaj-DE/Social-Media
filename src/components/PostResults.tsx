"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import PostSkeleton from "./PostSkeleton";

export default function PostResults({ q }: { q: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      setLoading(true);
      const res = await fetch(`/api/search/posts?q=${q}`);
      const data = await res.json();

      const normalized = (data.posts || []).map((post: any) => ({
        id: post._id || post.id,
        content: post.content || "",
        imageUrl: post.imageUrl || "",
        likes: post.likes || [],           // 🔥 ENSURE ARRAY
        comments: post.comments || [],     // 🔥 ENSURE ARRAY
        isOwner: false,                    // search ≠ ownership context
        user: post.user
          ? {
              id: post.user._id || post.user.id,
              name: post.user.name,
              profilePic: post.user.profilePic,
            }
          : null,
      }));

      if (!ignore) setPosts(normalized);
      setLoading(false);
    };

    run();
    return () => {
      ignore = true;
    };
  }, [q]);

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-sm text-muted pt-4">No posts found</p>;
  }

  return (
    <div className="space-y-4 pt-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId="" // 👈 safe placeholder for now
        />
      ))}
    </div>
  );
}
