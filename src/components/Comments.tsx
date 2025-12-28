"use client";

import { useState } from "react";

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticComment = {
      id: tempId,
      text,
      pending: true,
      user: { name: "You" }, // placeholder
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setText("");

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Comment failed");

      const saved = await res.json();

      // replace temp with real comment
      setComments((prev) =>
        prev.map((c) =>
          c.id === tempId ? saved : c
        )
      );
    } catch (e) {
      // rollback
      setComments((prev) =>
        prev.filter((c) => c.id !== tempId)
      );
      alert("Failed to post comment");
    }
  };

  return (
    <div className="space-y-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment…"
        className="w-full border border-glass rounded px-3 py-1 text-sm"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="text-sm text-accent"
      >
        Post
      </button>

      {comments.map((c) => (
        <div
          key={c.id}
          className={`text-sm ${
            c.pending ? "opacity-60 italic" : ""
          }`}
        >
          <strong>{c.user.name}</strong>: {c.text}
        </div>
      ))}
    </div>
  );
}
