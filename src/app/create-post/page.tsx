"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitPost = async () => {
    setError("");

    // 🔒 Validation (non-negotiable)
    if (!content.trim() && !file) {
      setError("Post cannot be empty");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      // 1️⃣ Upload image first (if exists)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Image upload failed");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // 2️⃣ Create post
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          imageUrl,
        }),
      });

      if (!postRes.ok) {
        throw new Error("Post creation failed");
      }

      // 3️⃣ Redirect to home
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-xl bg-white p-6 rounded space-y-4">
        <h1 className="text-xl font-semibold">Create Post</h1>

        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2 resize-none"
          rows={4}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={submitPost}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
