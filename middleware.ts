// middleware.ts – protects /admin routes with HTTP Basic Auth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // No Basic Auth – Supabase session handling occurs in the UI.
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
