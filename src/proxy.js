import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/auth";

const authRoutes = ["/login", "/register"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (authRoutes.includes(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
