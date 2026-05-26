// src/app/api/basic-auth/route.ts – returns 401 challenge for Basic Auth
import { NextResponse } from "next/server";

export async function GET() {
  const res = new NextResponse("Auth Required", {
    status: 401,
    headers: {
      "WWW-Authenticate": "Basic realm=\"Admin Area\"",
    },
  });
  return res;
}

// Also handle POST (if a form posts)
export async function POST() {
  return GET();
}
