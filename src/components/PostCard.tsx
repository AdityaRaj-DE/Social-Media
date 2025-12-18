import Image from "next/image";
import LikeButton from "./LikeButton";

export default function PostCard({
  post,
  currentUserId,
}: {
  post: any;
  currentUserId: string;
}) {
    const likedByUser = post.likes?.some(
        (id: any) => id.toString() === currentUserId
      );
      

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

      <LikeButton
        postId={post._id.toString()}
        initialLiked={likedByUser}
        initialCount={post.likes?.length || 0}
      />
    </div>
  );
}
