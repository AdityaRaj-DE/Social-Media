import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Missing credentials" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken(user._id.toString());

    cookies().set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
