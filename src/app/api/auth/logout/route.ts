import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // 🔥 await it
  cookieStore.delete("token");

  return Response.json({ success: true });
}
