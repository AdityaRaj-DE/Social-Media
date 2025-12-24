"use client";

import { useState } from "react";

export default function Comments({
  postId,
  comments,
}: {
  postId: string;
  comments: any[];
}) {
  const [text, setText] = useState("");

  const addComment = async () => {
    if (!text.trim()) return;

    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    window.location.reload();
  };

  const deleteComment = async (commentId: string) => {
    await fetch(
      `/api/posts/${postId}/comments/${commentId}`,
      { method: "DELETE" }
    );
    window.location.reload();
  };

  return (
    <div className="pt-3 space-y-3">
      {comments.map((c) => (
        <div
          key={c.id}
          className="flex justify-between items-start text-sm"
        >
          <p className="text-text">
            <span className="font-semibold">
              {c.user.name}
            </span>{" "}
            <span className="text-muted">{c.text}</span>
          </p>
  
          {c.isOwner && (
            <button
              onClick={() => deleteComment(c.id)}
              className="text-xs text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ))}
  
      {/* Add comment */}
      <div className="flex gap-2 pt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className="
            flex-1
            rounded-lg
            bg-transparent
            border border-glass
            px-3 py-2
            text-sm
            placeholder:text-muted
            outline-none
            focus:ring-2 focus:ring-accent/40
          "
        />
  
        <button
          onClick={addComment}
          className="
            rounded-pill
            bg-accent
            px-4 py-2
            text-sm font-medium
            text-white
            hover:bg-accent-600
            transition
          "
        >
          Post
        </button>
      </div>
    </div>
  );  
}
