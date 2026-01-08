"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  PlusSquare,
  Settings,
} from "lucide-react";
import type { NavbarUser } from "@/types/user";

type NavbarProps = {
  user: NavbarUser;
};

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/create-post", icon: PlusSquare, label: "Create", primary: false },
  { href: "/setting", icon: Settings, label: "Settings" },
];

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bg-bg bottom-0 left-0 right-0 z-40 md:hidden border-t border-glass">
      <div className="flex justify-around items-center h-14">
        {navItems.map(({ href, icon: Icon, label, primary }) => {
          const active = pathname === href;

          if (primary) {
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-center -mt-6"
              >
                <div className="h-12 w-12 rounded-full bg-accent text-text flex items-center justify-center shadow-lg active:scale-95 transition">
                  <Icon size={26} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center text-xs transition
                ${active ? "text-accent" : "text-muted hover:text-text"}
              `}
            >
              <Icon size={22} />
              {/* <span>{label}</span> */}
            </Link>
          );
        })}

        {/* PROFILE ICON (USER-DEPENDENT) */}
        <Link
          href="/profile"
          className={`flex flex-col items-center text-xs transition
            ${pathname === "/profile"
              ? "text-accent"
              : "text-muted hover:text-text"}
          `}
        >
          <Image
            src={user.profilePic || "/default-avatar.png"}
            alt={user.name}
            width={22}
            height={22}
            className="rounded-full object-cover"
          />
          {/* <span>Profile</span> */}
        </Link>
      </div>
    </nav>
  );
}
