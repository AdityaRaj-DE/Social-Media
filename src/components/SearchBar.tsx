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
    <div className="relative w-full">
      <form onSubmit={submitSearch}>
        <input
          value={q}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search users or posts"
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
      </form>

      {users.length > 0 && (
        <div className="absolute mt-2 w-full glass rounded-card overflow-hidden z-50">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/user/${u.id}`}
              onClick={() => setUsers([])}
              className="block px-3 py-2 text-sm hover:bg-surface transition"
            >
              {u.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
