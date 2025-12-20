"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  const handleChange = async (value: string) => {
    setQ(value);

    if (value.trim().length < 2) {
      setUsers([]);
      return;
    }

    // 🔍 USER SEARCH (LIVE)
    const res = await fetch(`/api/search/users?q=${value}`);
    const data = await res.json();
    setUsers(data);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;

    // 🔍 POST SEARCH (PAGE)
    router.push(`/search?q=${q}`);
    setUsers([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={submitSearch}>
        <input
          value={q}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search users or posts"
          className="w-full border px-3 py-2 rounded"
        />
      </form>

      {/* USER RESULTS DROPDOWN */}
      {users.length > 0 && (
        <div className="absolute bg-white border w-full mt-1 rounded shadow z-50">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/user/${u.id}`}
              className="block px-3 py-2 hover:bg-gray-100"
              onClick={() => setUsers([])}
            >
              {u.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
