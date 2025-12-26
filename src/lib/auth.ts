import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import User from "../models/User";
import { connectDB } from "./db";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("token")?.value;
  const headersList = await headers();
  const authHeader = headersList.get("authorization");
const bearerToken = authHeader?.startsWith("Bearer ")
  ? authHeader.slice(7)
  : null;

const token = bearerToken || cookieToken;


  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  await connectDB();
  return User.findById(decoded.id).select("-password");
}
