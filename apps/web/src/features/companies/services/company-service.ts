import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  Company,
  CreateCompanyInput,
} from "@/features/companies/types/company-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

function getErrorMessage(response: ApiErrorResponse | unknown): string {
  if (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    typeof response.error === "object" &&
    response.error !== null &&
    "message" in response.error &&
    typeof response.error.message === "string"
  ) {
    return response.error.message;
  }

  return "Não foi possível criar o cliente.";
}

export async function createCompany(input: CreateCompanyInput): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    body: JSON.stringify(input),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const payload = (await response.json()) as ApiSuccessResponse<Company> | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload));
  }

  return (payload as ApiSuccessResponse<Company>).data;
}
