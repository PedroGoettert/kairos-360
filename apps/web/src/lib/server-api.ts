import { cookies } from "next/headers";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/features/companies/types/company-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export class ServerApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ServerApiError";
  }
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return fallback;
}

export async function getFromApi<T>(path: string): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
  const payload = (await response.json().catch(() => null)) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse
    | null;

  if (!response.ok) {
    throw new ServerApiError(
      getErrorMessage(payload, "Nao foi possivel consultar a API."),
      response.status,
    );
  }

  if (!payload || !("data" in payload)) {
    throw new Error("A API retornou uma resposta invalida.");
  }

  return payload.data;
}
