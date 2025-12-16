"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={submit}>
      {Object.keys(form).map(key => (
        <input
          key={key}
          placeholder={key}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
        />
      ))}
      <button>Register</button>
    </form>
  );
}
