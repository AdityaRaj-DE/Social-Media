import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { Types } from "mongoose";

// /api/posts/[postId]/comments/route.ts

const LIMIT = 10;

type LeanComment = {
  _id: any;
  text: string;
  createdAt: Date;
  user: {
    _id: any;
    name: string;
    profilePic?: string;
  };
};

export async function GET(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  await connectDB();

  type LeanPostWithComments = {
    _id: Types.ObjectId;
    comments: LeanComment[];
  };
  
  const post = await Post.findById(postId)
    .populate({
      path: "comments.user",
      select: "name profilePic",
    })
    .lean<LeanPostWithComments>();
  
  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }
  

  const comments = (post.comments as LeanComment[])
    .sort(
      (a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime()
    )
    .filter(
      (c) =>
        !cursor || c._id.toString() < cursor
    )
    .slice(0, LIMIT);

  return NextResponse.json({
    comments: comments.map((c) => ({
      id: c._id.toString(),
      text: c.text,
      createdAt: c.createdAt,
      user: {
        id: c.user._id.toString(),
        name: c.user.name,
        profilePic: c.user.profilePic,
      },
    })),
    nextCursor:
      comments.length === LIMIT
        ? comments[comments.length - 1]._id.toString()
        : null,
  });
}



export async function POST(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params; // ✅ FIX

    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Comment text required" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const comment = {
      text,
      user: user._id,
      createdAt: new Date(),
    };

    post.comments.unshift(comment);
    await post.save();

    const saved = post.comments[0];

    return NextResponse.json({
      id: saved._id.toString(),
      text: saved.text,
      user: {
        id: user._id.toString(),
        name: user.name,
        profilePic: user.profilePic,
      },
      createdAt: saved.createdAt,
    });
  } catch (err) {
    console.error("CREATE COMMENT ERROR", err);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
