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
      <div className="flex min-h-screen flex-col justify-center px-6 bg-bg text-text">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Create account
          </h1>
          <p className="mt-2 text-sm text-muted">
            It takes less than a minute
          </p>
        </motion.div>
  
        {/* Glass Card */}
        <form
          onSubmit={submit}
          className="glass rounded-card p-5 space-y-4"
        >
          {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
            <input
              key={key}
              type={key === "password" ? "password" : "text"}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
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
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          ))}
  
          <button
            type="submit"
            className="
              mt-2 w-full rounded-pill
              bg-accent
              py-3 text-sm font-semibold
              text-white
              hover:bg-accent-600
              transition
              active:scale-[0.97]
            "
          >
            Register
          </button>
        </form>
  
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted">
          Already have an account?{" "}
          <button
            className="text-accent hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </MobileShell>
  );  
}
