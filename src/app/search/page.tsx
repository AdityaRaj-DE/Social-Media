import { headers } from "next/headers";
import PostCard from "@/components/PostCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cursor?: string }>;
}) {
  const { q, cursor } = await searchParams;

  if (!q) {
    return <div className="p-6">Search something…</div>;
  }

  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
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
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold">
        Search results for "{q}"
      </h1>

      {posts.length === 0 && (
        <div className="text-gray-500">No posts found</div>
      )}

      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}

      {nextCursor && (
        <a
          href={`/search?q=${q}&cursor=${nextCursor}`}
          className="block text-center text-blue-600"
        >
          Load more
        </a>
      )}
    </div>
  );
}
