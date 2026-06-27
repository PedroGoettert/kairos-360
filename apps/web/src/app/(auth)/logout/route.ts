import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");

  if (cookieHeader) {
    try {
      await fetch(`${API_BASE_URL}/auth/sign-out`, {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
        method: "POST",
      });
    } catch {
      // Local logout must still succeed when the API is unavailable.
    }
  }

  const response = NextResponse.redirect(new URL("/login", request.url), 303);

  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.includes("better-auth")) {
      response.cookies.delete(cookie.name);
    }
  }

  return response;
}
