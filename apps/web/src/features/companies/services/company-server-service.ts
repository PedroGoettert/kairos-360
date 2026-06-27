import type { Company } from "@/features/companies/types/company-types";
import { getFromApi } from "@/lib/server-api";

export async function listCompanies(): Promise<Company[]> {
  return getFromApi<Company[]>("/companies");
}
