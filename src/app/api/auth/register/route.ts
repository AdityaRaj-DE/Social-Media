import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, name, age, email, password } = await req.json();

    if (!username || !name || !email || !password || !age) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return Response.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      name,
      age,
      email,
      password: hashedPassword,
    });

    const token = signToken(user._id.toString());
    const cookieStore = await cookies();
    
    
    cookieStore.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
