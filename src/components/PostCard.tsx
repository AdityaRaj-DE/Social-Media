import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="border rounded p-4 space-y-2 bg-white">
      <div className="font-semibold">{post.user?.name}</div>

      {post.content && (
        <p className="text-sm text-gray-800">{post.content}</p>
      )}

      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt=""
          width={400}
          height={400}
          className="rounded"
        />
      )}

      <div className="text-xs text-gray-500">
        {post.likes?.length || 0} likes
      </div>
    </div>
  );
}
