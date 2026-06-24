import { and, desc, eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import { companies } from "../../database/schema/index.js";
import type {
  CompaniesList,
  Company,
  CreateCompanyInput,
} from "./companies.types.js";

export async function createCompany(
  ownerUserId: string,
  input: CreateCompanyInput,
): Promise<Company> {
  const [company] = await db
    .insert(companies)
    .values({
      ownerUserId,
      ...input,
    })
    .returning();

  if (!company) {
    throw new Error("Company creation failed");
  }

  return company;
}

export async function listCompanies(ownerUserId: string): Promise<CompaniesList> {
  return db
    .select()
    .from(companies)
    .where(eq(companies.ownerUserId, ownerUserId))
    .orderBy(desc(companies.createdAt));
}

export async function getCompanyById(
  ownerUserId: string,
  companyId: string,
): Promise<Company | null> {
  const [company] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.id, companyId), eq(companies.ownerUserId, ownerUserId)))
    .limit(1);

  return company ?? null;
}
