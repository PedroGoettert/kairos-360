import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export async function hasActiveSession(): Promise<boolean> {
  const cookieHeader = (await cookies()).toString();

  if (!cookieHeader) {
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
    cache: "no-store",
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    return false;
  }

  const session = (await response.json().catch(() => null)) as unknown;

  return Boolean(session);
}

export async function requireSession(redirectTo: string): Promise<void> {
  if (!(await hasActiveSession())) {
    redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
}
