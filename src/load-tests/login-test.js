import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "30s", target: 50 },
    { duration: "10s", target: 0 },
  ],
};

export function setup() {
  const payload = JSON.stringify({
    email: "test@test.com",
    password: "test",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(
    "https://social-media-rho-blue.vercel.app/api/auth/login",
    payload,
    params
  );

  if (res.status !== 200) {
    throw new Error("Login failed");
  }

  // ⚠️ IMPORTANT
  // Do NOT extract token
  // Cookie is automatically stored by k6

  return {};
}

export default function () {
  const profile = http.get(
    "https://social-media-rho-blue.vercel.app/api/profile"
  );

  check(profile, {
    "profile 200": (r) => r.status === 200,
  });

  sleep(1);

  const posts = http.get(
    "https://social-media-rho-blue.vercel.app/api/posts"
  );

  check(posts, {
    "posts 200": (r) => r.status === 200,
  });

  sleep(1);
}