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
    <div className="space-y-2">
      {comments.map((c) => (
        <div key={c.id} className="text-sm flex justify-between">
          <span>
            <b>{c.user.name}:</b> {c.text}
          </span>

          {c.isOwner && (
            <button
              onClick={() => deleteComment(c.id)}
              className="text-red-500 text-xs"
            >
              Delete
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
          className="border px-2 py-1 text-sm flex-1"
        />
        <button
          onClick={addComment}
          className="text-sm bg-black text-white px-3"
        >
          Post
        </button>
      </div>
    </div>
  );
}
