import type {
  AuthErrorResponse,
  LoginFormValues,
  SignupInput,
} from "@/features/auth/types/auth-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

function getAuthErrorMessage(payload: AuthErrorResponse | unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return "Nao foi possivel fazer login.";
  }

  if (
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  if ("message" in payload && typeof payload.message === "string") {
    return payload.message;
  }

  return "Nao foi possivel fazer login.";
}

export async function signInWithEmail(input: LoginFormValues): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-in/email`, {
    body: JSON.stringify(input),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as unknown;
    throw new Error(getAuthErrorMessage(payload));
  }
}

export async function signUpWithEmail(input: SignupInput): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-up/email`, {
    body: JSON.stringify(input),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as unknown;
    throw new Error(getAuthErrorMessage(payload));
  }
}
