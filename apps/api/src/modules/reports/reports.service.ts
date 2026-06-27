import { and, eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import { companies, reports } from "../../database/schema/index.js";
import { getCompanyById } from "../companies/companies.service.js";
import {
  getDiagnosticById,
  getDiagnosticScores,
  listDiagnosticAnswers,
} from "../diagnostics/diagnostics.service.js";
import type {
  CreateManualDiagnosticReportResult,
  Report,
  ReportFormat,
} from "./reports.types.js";

function getReportMimeType(format: ReportFormat): string {
  return format === "pdf"
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}

function buildReportFileName(
  companyName: string,
  diagnosticId: string,
  format: ReportFormat,
): string {
  const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return `${companySlug}-diagnostic-${diagnosticId}.${format}`;
}

export async function createManualDiagnosticReport(
  currentUserId: string,
  diagnosticId: string,
  format: ReportFormat,
): Promise<CreateManualDiagnosticReportResult> {
  const diagnostic = await getDiagnosticById(currentUserId, diagnosticId);

  if (!diagnostic) {
    return { status: "diagnostic_not_found" };
  }

  const company = await getCompanyById(currentUserId, diagnostic.companyId);

  if (!company) {
    return { status: "diagnostic_not_found" };
  }

  const scoresResult = await getDiagnosticScores(currentUserId, diagnosticId);

  if (scoresResult.status !== "found") {
    return { status: "diagnostic_not_completed" };
  }

  const answers = await listDiagnosticAnswers(currentUserId, diagnosticId);

  if (!answers) {
    return { status: "diagnostic_not_found" };
  }

  const content = {
    company: {
      id: company.id,
      name: company.name,
      tradeName: company.tradeName,
      industry: company.industry,
      website: company.website,
    },
    diagnostic: {
      id: diagnostic.id,
      title: diagnostic.title,
      notes: diagnostic.notes,
      status: diagnostic.status,
      completedAt: diagnostic.completedAt,
      createdAt: diagnostic.createdAt,
    },
    scores: scoresResult.summary,
    answers,
  };

  const [report] = await db
    .insert(reports)
    .values({
      companyId: company.id,
      diagnosticId: diagnostic.id,
      createdByUserId: currentUserId,
      kind: "manual_diagnostic",
      format,
      title: diagnostic.title ?? `Diagnostic report ${diagnostic.id}`,
      fileName: buildReportFileName(company.name, diagnostic.id, format),
      mimeType: getReportMimeType(format),
      content,
    })
    .returning();

  if (!report) {
    throw new Error("Report creation failed");
  }

  return {
    status: "created",
    report: report as Report,
  };
}

export async function getReportById(
  currentUserId: string,
  reportId: string,
): Promise<Report | null> {
  const [report] = await db
    .select({
      id: reports.id,
      companyId: reports.companyId,
      diagnosticId: reports.diagnosticId,
      createdByUserId: reports.createdByUserId,
      kind: reports.kind,
      format: reports.format,
      title: reports.title,
      fileName: reports.fileName,
      mimeType: reports.mimeType,
      content: reports.content,
      createdAt: reports.createdAt,
      updatedAt: reports.updatedAt,
    })
    .from(reports)
    .innerJoin(companies, eq(reports.companyId, companies.id))
    .where(and(eq(reports.id, reportId), eq(companies.ownerUserId, currentUserId)))
    .limit(1);

  return (report as Report | undefined) ?? null;
}
