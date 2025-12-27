import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserSkeleton from "./UserSkeleton";

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
    return (
      <div className="glass rounded-card divide-y divide-glass mt-4">
        {[...Array(5)].map((_, i) => (
          <UserSkeleton key={i} />
        ))}
      </div>
    );
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
          className="
            flex items-center gap-3 px-4 py-3
            hover:bg-surface transition
            active:scale-[0.98]
          "
        >
          {/* Avatar */}
          <Image
            src={u.profilePic || "/avatar-placeholder.png"}
            alt={u.name}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-text">
              {u.name}
            </span>

            {/* Placeholder for future */}
            <span className="text-xs text-muted">
              View profile
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
