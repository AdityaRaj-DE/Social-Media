"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileShell from "@/components/MobileShell";


export default function EditProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!name.trim() || !age) {
      setError("Name and age are required");
      return;
    }

    try {
      setLoading(true);

      let profilePic = "";

      // Upload new image if selected
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

        const data = await uploadRes.json();
        profilePic = data.url;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          profilePic,
        }),
      });

      if (!res.ok) {
        throw new Error("Profile update failed");
      }

      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell>
    <div className="min-h-screen bg-bg mt-8 text-text flex justify-center px-4 py-10">
      <div className="glass rounded-card w-full max-w-md p-6 space-y-4">
        <h1 className="text-xl font-bold">Edit Profile</h1>
  
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full
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
  
        <input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="
            w-full
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
  
        <input
        placeholder="image"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm text-muted"
        />
  
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
  
        <button
          onClick={submit}
          disabled={loading}
          className="
            w-full
            rounded-pill
            bg-accent
            py-2.5
            text-sm font-semibold
            text-white
            hover:bg-accent-600
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
  
        <Link
          href="/profile"
          className="block text-center text-sm text-muted hover:underline"
        >
          Cancel
        </Link>
      </div>
    </div>
    </MobileShell>
  );  
}
