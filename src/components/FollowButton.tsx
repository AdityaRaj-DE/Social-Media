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
      className={`px-4 py-1 rounded text-sm ${
        following ? "bg-gray-300" : "bg-blue-600 text-white"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
