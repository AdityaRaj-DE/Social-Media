import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 50 },
    { duration: "10s", target: 0 },
  ],
};

export default function () {
  const payload = JSON.stringify({
    email: "test@test.com",
    password: "test",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    "http://localhost:3000/login",
    payload,
    params
  );

  check(res, {
    "login status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}
