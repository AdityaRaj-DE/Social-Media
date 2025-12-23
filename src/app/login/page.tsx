"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import MobileShell from "@/components/MobileShell";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();


    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) router.push("/home");
    else alert("Invalid credentials");
  };

  return (
    <MobileShell>
      <div className="bg-bg text-text p-6">
        <div className="bg-red-500 text-white p-6">
          TAILWIND TEST
        </div>

      </div>

      <div className="flex min-h-screen flex-col justify-center px-6 bg-bg text-text">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to continue
          </p>
        </motion.div>

        {/* Glass Card */}
        <form
          onSubmit={submit}
          className="glass rounded-card p-5 space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="
              w-full rounded-lg
              bg-transparent
              border border-glass
              px-4 py-3 text-sm
              placeholder:text-muted
              outline-none
              focus:ring-2 focus:ring-accent/40
              transition
            "
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="
              w-full rounded-lg
              bg-transparent
              border border-glass
              px-4 py-3 text-sm
              placeholder:text-muted
              outline-none
              focus:ring-2 focus:ring-accent/40
              transition
            "
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="
              w-full rounded-pill
              bg-accent
              py-3 text-sm font-semibold
              text-white
              hover:bg-accent-600
              transition
              active:scale-[0.97]
            "
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-xs text-muted">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:text-text transition"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          )}

          <button
            onClick={() => router.push("/register")}
            className="hover:text-accent transition"
          >
            Create account
          </button>
        </div>
      </div>
    </MobileShell>
  );

}
