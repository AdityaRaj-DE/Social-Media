"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ user }: { user: any }) {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-glass">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          Social<span className="text-accent">Media</span>
        </Link>
        <Link
          href="/create-post"
          className="
    rounded-pill
    bg-accent
    px-4 py-1.5
    text-sm font-semibold
    text-white
    hover:bg-accent-600
    transition
  "
        >
          Create
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            <Image
              src={user.profileImage || "/avatar-placeholder.png"}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="text-sm font-medium text-text hidden sm:block">
              {user.name}
            </span>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="
              rounded-pill
              px-4 py-1.5
              text-sm
              border border-glass
              hover:bg-surface
              transition
              active:scale-95
            "
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
