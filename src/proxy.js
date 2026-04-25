import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vitacare-local-secret"
);

export async function middleware(request) {
  const token = request.cookies.get("vitacare_session")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = [
    "/login",
    "/manifest.json",
    "/icon-192.png",
    "/icon-512.png",
    "/favicon.ico"
  ];

  if (
    publicPaths.includes(path) ||
    path.startsWith("/_next") ||
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, SECRET);

    if (path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("vitacare_session");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};