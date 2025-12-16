import Image from "next/image";

async function getPosts() {
  const res = await fetch("http://localhost:3000/api/posts", {
    credentials: "include",
    cache: "no-store",
  });
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map((post: any) => (
        <div key={post._id}>
          <p>{post.user.name}</p>
          <p>{post.content}</p>
          {post.imageUrl && (
            <Image src={post.imageUrl} alt="" width={300} height={300} />
          )}
        </div>
      ))}
    </div>
  );
}
