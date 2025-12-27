"use client";

import { useState } from "react";
import UserResults from "./UserResults";
import PostResults from "./PostResults";

export default function SearchTabs() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"users" | "posts">("users");

  return (
    <>
      {/* Search Input */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search users or posts"
        className="
          w-full rounded-xl bg-transparent
          border border-glass px-4 py-2
          text-sm placeholder:text-muted
          outline-none focus:ring-2 focus:ring-accent/40
        "
      />

      {/* Tabs */}
      <div className="flex border-b border-glass">
        {["users", "posts"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-2 text-sm font-medium transition
              ${
                tab === t
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted hover:text-text"
              }`}
          >
            {t === "users" ? "Users" : "Posts"}
          </button>
        ))}
      </div>

      {/* Results */}
      {q.length < 2 ? (
        <p className="text-sm text-muted pt-4">Type at least 2 characters</p>
      ) : tab === "users" ? (
        <UserResults q={q} />
      ) : (
        <PostResults q={q} />
      )}
    </>
  );
}
