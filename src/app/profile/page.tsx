async function getProfile() {
    const res = await fetch("http://localhost:3000/api/users/me", {
      credentials: "include",
      cache: "no-store",
    });
    return res.json();
  }
  
  async function getMyPosts() {
    const res = await fetch("http://localhost:3000/api/users/me/posts", {
      credentials: "include",
      cache: "no-store",
    });
    return res.json();
  }
  
  export default async function ProfilePage() {
    const user = await getProfile();
    const posts = await getMyPosts();
  
    return (
      <div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
  
        {posts.map((p: any) => (
          <p key={p._id}>{p.content}</p>
        ))}
      </div>
    );
  }
  