const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type ApiEnvelope<T> = { data: T };
type ApiErrorEnvelope = { error?: { message?: string; code?: string } };

export class ClientApiError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "ClientApiError";
  }
}

export async function requestApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | ApiErrorEnvelope | null;

  if (!response.ok || !payload || !("data" in payload)) {
    const error = payload && "error" in payload ? payload.error : undefined;
    throw new ClientApiError(error?.message ?? "Não foi possível concluir a operação.", error?.code);
  }

  return payload.data;
}
