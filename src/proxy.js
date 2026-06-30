import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/auth";

const authRoutes = ["/login", "/register"];

const dashboardByRole = {
  client: "/dashboard/client",
  freelancer: "/dashboard/freelancer",
  admin: "/dashboard/admin",
};

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

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.user?.isBlocked) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = session.user?.role || "client";
    const ownDashboard = dashboardByRole[role] || "/dashboard/client";

    if (!pathname.startsWith(ownDashboard)) {
      return NextResponse.redirect(new URL(ownDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
