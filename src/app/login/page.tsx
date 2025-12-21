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
      <div className="flex min-h-screen flex-col justify-center px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm opacity-60">
            Sign in to your account
          </p>
        </motion.div>

        {/* Form Card */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-5 space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="
              w-full rounded-2xl
              bg-black/5 dark:bg-white/10
              px-4 py-4 text-sm
              outline-none
              focus:bg-black/10 dark:focus:bg-white/15
              focus:ring-2 focus:ring-black dark:focus:ring-white
              transition
            "
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="
              w-full rounded-2xl
              bg-black/5 dark:bg-white/10
              px-4 py-4 text-sm
              outline-none
              focus:bg-black/10 dark:focus:bg-white/15
              focus:ring-2 focus:ring-black dark:focus:ring-white
              transition
            "
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="
              w-full rounded-3xl
              bg-black dark:bg-white
              py-4 text-sm font-semibold
              text-white dark:text-black
              transition
              active:scale-[0.97]
            "
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-xs opacity-60">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          )}


          <button onClick={() => router.push("/register")}>
            Create account
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
