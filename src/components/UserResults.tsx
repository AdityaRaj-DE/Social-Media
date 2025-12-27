"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserResults({ q }: { q: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      setLoading(true);
      const res = await fetch(`/api/search/users?q=${q}`);
      const data = await res.json();
      if (!ignore) setResults(data);
      setLoading(false);
    };

    run();
    return () => {
      ignore = true;
    };
  }, [q]);

  if (loading) {
    return <p className="text-sm text-muted pt-4">Searching users…</p>;
  }

  if (results.length === 0) {
    return <p className="text-sm text-muted pt-4">No users found</p>;
  }

  return (
    <div className="glass rounded-card divide-y divide-glass">
      {results.map((u) => (
        <Link
          key={u.id}
          href={`/user/${u.id}`}
          className="block px-4 py-3 hover:bg-surface transition text-sm"
        >
          {u.name}
        </Link>
      ))}
    </div>
  );
}
