"use client";

import { useState } from "react";
import Link from "next/link";

export default function UserSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const search = async (value: string) => {
    setQ(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }

    const res = await fetch(`/api/search/users?q=${value}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => search(e.target.value)}
        placeholder="Search users..."
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

      {results.length > 0 && (
        <div className="absolute mt-2 w-full glass rounded-card z-50">
          {results.map((u) => (
            <Link
              key={u.id}
              href={`/user/${u.id}`}
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
