import { and, desc, eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import {
  companies,
  diagnosticAnswers,
  diagnosticQuestions,
  diagnostics,
} from "../../database/schema/index.js";
import { getCompanyById } from "../companies/companies.service.js";
import type {
  CreateDiagnosticAnswerInput,
  CreateDiagnosticAnswerResult,
  CreateDiagnosticInput,
  Diagnostic,
  DiagnosticsList,
} from "./diagnostics.types.js";

export async function createDiagnostic(
  currentUserId: string,
  input: CreateDiagnosticInput,
): Promise<Diagnostic | null> {
  const company = await getCompanyById(currentUserId, input.companyId);

  if (!company) {
    return null;
  }

  const [diagnostic] = await db
    .insert(diagnostics)
    .values({
      companyId: input.companyId,
      createdByUserId: currentUserId,
      title: input.title,
      notes: input.notes,
    })
    .returning();

  if (!diagnostic) {
    throw new Error("Diagnostic creation failed");
  }

  return diagnostic;
}

export async function listDiagnosticsByCompany(
  currentUserId: string,
  companyId: string,
): Promise<DiagnosticsList | null> {
  const company = await getCompanyById(currentUserId, companyId);

  if (!company) {
    return null;
  }

  return db
    .select()
    .from(diagnostics)
    .where(eq(diagnostics.companyId, companyId))
    .orderBy(desc(diagnostics.createdAt));
}

export async function getDiagnosticById(
  currentUserId: string,
  diagnosticId: string,
): Promise<Diagnostic | null> {
  const [diagnostic] = await db
    .select({
      id: diagnostics.id,
      companyId: diagnostics.companyId,
      createdByUserId: diagnostics.createdByUserId,
      title: diagnostics.title,
      notes: diagnostics.notes,
      status: diagnostics.status,
      completedAt: diagnostics.completedAt,
      createdAt: diagnostics.createdAt,
      updatedAt: diagnostics.updatedAt,
    })
    .from(diagnostics)
    .innerJoin(companies, eq(diagnostics.companyId, companies.id))
    .where(
      and(
        eq(diagnostics.id, diagnosticId),
        eq(companies.ownerUserId, currentUserId),
      ),
    )
    .limit(1);

  return diagnostic ?? null;
}

export async function createDiagnosticAnswer(
  currentUserId: string,
  diagnosticId: string,
  input: CreateDiagnosticAnswerInput,
): Promise<CreateDiagnosticAnswerResult> {
  const diagnostic = await getDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return { status: "diagnostic_not_found" };
  }

  if (diagnostic.status === "completed") {
    return { status: "diagnostic_completed" };
  }

  const [question] = await db
    .select({
      id: diagnosticQuestions.id,
    })
    .from(diagnosticQuestions)
    .where(
      and(
        eq(diagnosticQuestions.id, input.questionId),
        eq(diagnosticQuestions.isActive, true),
      ),
    )
    .limit(1);

  if (!question) {
    return { status: "question_not_found" };
  }

  const [existingAnswer] = await db
    .select({
      id: diagnosticAnswers.id,
    })
    .from(diagnosticAnswers)
    .where(
      and(
        eq(diagnosticAnswers.diagnosticId, diagnosticId),
        eq(diagnosticAnswers.questionId, input.questionId),
      ),
    )
    .limit(1);

  if (existingAnswer) {
    return { status: "answer_already_exists" };
  }

  const [answer] = await db
    .insert(diagnosticAnswers)
    .values({
      diagnosticId,
      questionId: input.questionId,
      score: input.score,
      comment: input.comment,
    })
    .returning();

  if (!answer) {
    throw new Error("Diagnostic answer creation failed");
  }

  return {
    status: "created",
    answer,
  };
}
