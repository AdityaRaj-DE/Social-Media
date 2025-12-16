"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const submit = async () => {
    let imageUrl = "";

    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const upload = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await upload.json();
      imageUrl = data.url;
    }

    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, imageUrl }),
    });

    router.push("/home");
  };

  return (
    <>
      <textarea onChange={e => setContent(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={submit}>Post</button>
    </>
  );
}
