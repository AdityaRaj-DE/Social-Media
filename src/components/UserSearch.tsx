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
        className="border px-3 py-2 w-full"
      />

      {results.length > 0 && (
        <div className="absolute bg-white border w-full mt-1 z-10">
          {results.map((u) => (
            <Link
              key={u.id}
              href={`/user/${u.id}`}
              className="block px-3 py-2 hover:bg-gray-100"
            >
              {u.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
