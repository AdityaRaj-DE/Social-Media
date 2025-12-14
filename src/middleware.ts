import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Public routes (no auth needed)
  const publicPaths = [
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
  ];

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Protect API routes & pages
  if (!token) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
    matcher: [
      "/((?!_next|favicon.ico).*)",
    ],
  };
  