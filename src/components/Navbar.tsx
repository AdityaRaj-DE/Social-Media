"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  PlusSquare,
  User,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/create-post", icon: PlusSquare, label: "Create", primary: true },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-glass">
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
                <div
                  className="
            h-12 w-12
            rounded-full
            bg-accent
            text-white
            flex items-center justify-center
            shadow-lg
            active:scale-95
            transition
          "
                >
                  <Icon size={26} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center text-xs transition-all duration-200
        ${active ? "text-accent" : "text-muted hover:text-text"}
      `}
            >
              <Icon
                size={22}
                className={`transition-transform duration-200
          ${active ? "scale-110 -translate-y-0.5" : ""}
        `}
              />
              <span>{label}</span>
              {active && (
                <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}

      </div>
    </nav>
  );
}
