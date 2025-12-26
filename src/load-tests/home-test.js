import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 50 },
    { duration: "10s", target: 0 },
  ],
};

const BASE_URL = "http://localhost:3000";

export function setup() {
  const payload = JSON.stringify({
    email: "test@test.com",
    password: "test",
  });

  const res = http.post(
    `${BASE_URL}/login`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // 🔥 THIS IS THE FIX
      },
    }
  );
  
  console.log("STATUS:", res.status);
  console.log("HEADERS:", JSON.stringify(res.headers));
  console.log("BODY (first 200 chars):", res.body.slice(0, 200));
  check(res, {
    "login success": (r) => r.status === 200,
  });

  const body = JSON.parse(res.body);

  if (!body.token) {
    throw new Error("Token not found in response body");
  }

  return { token: body.token };
}


export default function (data) {
  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };
  

  const res = http.get(`${BASE_URL}/home`, params);

  check(res, {
    "home status is 200": (r) => r.status === 200,
    "home < 800ms": (r) => r.timings.duration < 800,
  });

  sleep(1);
}
