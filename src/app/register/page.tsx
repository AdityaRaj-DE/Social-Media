"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MobileShell from "@/components/MobileShell";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    name: "",
    age: "",
    email: "",
    password: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, age: Number(form.age) }),
    });

    if (res.ok) router.push("/home");
    else alert("User already exists");
  };

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col justify-center px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="mt-2 text-sm opacity-60">
            It takes less than a minute
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {(
            Object.keys(form) as (keyof typeof form)[]
          ).map((key) => (
            <input
              key={key}
              type={key === "password" ? "password" : "text"}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="w-full rounded-2xl bg-black/5 dark:bg-white/10 px-4 py-4 text-sm outline-none placeholder:opacity-50"
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          ))}

          <button
            type="submit"
            className="mt-6 w-full rounded-3xl bg-black py-4 text-sm font-semibold text-white transition active:scale-[0.98] dark:bg-white dark:text-black"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs opacity-60">
          Already have an account?{" "}
          <button
            className="underline"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
