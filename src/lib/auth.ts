import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
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
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  await connectDB();
  return User.findById(decoded.id).select("-password");
}
