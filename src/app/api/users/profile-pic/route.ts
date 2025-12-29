import { connectDB } from "../../../../lib/db";
import { getCurrentUser } from "../../../../lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return Response.json({ error: "Image URL required" }, { status: 400 });
  }

  await connectDB();

  user.profilePic = imageUrl;
  await user.save();

  return Response.json({ success: true });
}
