"use client";

import { useState } from "react";

export default function FollowButton({
  userId,
  initialFollowing,
}: {
  userId: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    if (loading) return;
    setLoading(true);

    const res = await fetch(`/api/users/${userId}/follow`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();
      setFollowing(data.following);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`
        rounded-pill
        px-4 py-1.5
        text-sm font-medium
        transition
        active:scale-95
        ${
          following
            ? "border border-glass text-text hover:bg-surface"
            : "bg-accent text-white hover:bg-accent-600"
        }
        disabled:opacity-50
      `}
    >
      {following ? "Following" : "Follow"}
    </button>
  );  
}
