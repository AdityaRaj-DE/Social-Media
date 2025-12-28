"use client";

import { useEffect, useRef, useState } from "react";

export default function Comments({
  postId,
  onNewComment,
  currentUserId,
  onDeleteComment,
}: {
  postId: string;
  onNewComment: () => void;
  currentUserId: string;
  onDeleteComment: () => void;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const loadComments = async () => {
    if (!hasMore) return;

    const res = await fetch(
      `/api/posts/${postId}/comments${cursor ? `?cursor=${cursor}` : ""}`
    );
    const data = await res.json();

    setComments((prev) => mergeUniqueById(prev, data.comments));

    setCursor(data.nextCursor);
    if (!data.nextCursor) setHasMore(false);
  };

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data.comments ?? []);
    };
    load();
  }, [postId]);

  const submit = async () => {
    if (!text.trim()) return;

    const tempId = `temp-${Date.now()}`;

    setComments((prev) => [
      {
        id: tempId,
        text,
        pending: true,
        user: { name: "You" },
      },
      ...prev,
    ]);

    setText("");
    onNewComment(); // optimistic count

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();

      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? saved : c))
      );
    } catch {
      setComments((prev) =>
        prev.filter((c) => c.id !== tempId)
      );
      onNewComment(); // ❌ rollback count (we incremented once)
    }
  };
  const deleteComment = async (commentId: string) => {
    const prev = comments;

    // 🔥 optimistic remove
    setComments((c) => c.filter((x) => x.id !== commentId));
    onDeleteComment(); // decrement count optimistically

    try {
      const res = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();
    } catch {
      // ❌ rollback
      setComments(prev);
      onDeleteComment(); // rollback count
      alert("Failed to delete comment");
    }
  };
  const mergeUniqueById = (prev: any[], next: any[]) => {
    const map = new Map<string, any>();
  
    [...prev, ...next].forEach((c) => {
      map.set(c.id, c); // later wins (server > optimistic)
    });
  
    return Array.from(map.values());
  };
  

  return (
    <div className="space-y-3">
      {hasMore && (
        <button
          onClick={loadComments}
          className="text-xs text-accent mb-2"
        >
          Load older comments
        </button>
      )}

      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment…"
        className="w-full border border-glass rounded px-3 py-2 text-sm"
      />

      <button
        onClick={submit}
        className="text-sm text-accent"
      >
        Post
      </button>

      {comments.map((c) => (
        <div
          key={c.id}
          className="flex justify-between items-start text-sm"
        >
          <div>
            <strong>{c.user.name}</strong>: {c.text}
          </div>

          {c.user.id === currentUserId && !c.pending && (
            <button
              onClick={() => deleteComment(c.id)}
              className="text-xs text-red-500 hover:underline ml-2"
            >
              Delete
            </button>
          )}
        </div>
      ))}

    </div>
  );
}
