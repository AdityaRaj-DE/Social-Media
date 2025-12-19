import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, age, profilePic } = await req.json();

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name,
        age,
        profilePic,
      },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("EDIT PROFILE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
