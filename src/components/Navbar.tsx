"use client";

export default function Navbar({ user }: { user: any }) {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b">
      <h1 className="text-xl font-bold">SocialMedia</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">{user.name}</span>
        <button
          onClick={logout}
          className="px-3 py-1 border rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
