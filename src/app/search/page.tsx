import { headers } from "next/headers";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cursor?: string }>;
}) {
  const { q, cursor } = await searchParams;

  if (!q) {
    return <div className="p-6">Search something…</div>;
  }

  // 🔥 headers() IS ASYNC
  const h = await headers();
  const host = h.get("host");
  const protocol =  "http";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(
    `${baseUrl}/api/search/posts?q=${q}${cursor ? `&cursor=${cursor}` : ""}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-6">Failed to fetch results</div>;
  }

  const { posts, nextCursor } = await res.json();

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-lg font-semibold">
          Search results for “{q}”
        </h1>
  
        {posts.length === 0 && (
          <p className="text-sm text-muted">
            No posts found
          </p>
        )}
  
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
  
        {nextCursor && (
          <Link
            href={`/search?q=${q}&cursor=${nextCursor}`}
            className="block text-center text-sm text-accent hover:underline"
          >
            Load more
          </Link>
        )}
      </div>
    </div>
  );
  
}
