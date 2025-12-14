import { connectDB } from "../../../../../lib/db";
import Post from "../../../../../models/Post";
import { getCurrentUser } from "../../../../../lib/auth";
import bcrypt from "bcryptjs";
import User from "../../../../../models/User";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 });

  return Response.json(posts);
}

export async function POST(req: Request) {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { name, age, password } = await req.json();
  
    await connectDB();
  
    const dbUser = await User.findById(user._id);
  
    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
  
    if (name) dbUser.name = name;
    if (age) dbUser.age = age;
    if (password) {
      dbUser.password = await bcrypt.hash(password, 10);
    }
  
    await dbUser.save();
  
    return Response.json({ success: true });
  }
