import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export async function signOutCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) {
    return;
  }

  const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
    cache: "no-store",
    headers: {
      cookie: cookieHeader,
    },
    method: "POST",
  });

  const setCookie = response.headers.get("set-cookie");

  if (setCookie) {
    const [cookiePart] = setCookie.split(";");
    const [name, value] = cookiePart.split("=");

    if (name) {
      cookieStore.set(name, value ?? "", {
        expires: new Date(0),
        path: "/",
      });
    }
  }
}
