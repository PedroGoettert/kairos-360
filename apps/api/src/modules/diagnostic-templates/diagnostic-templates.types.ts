import type { z } from "zod";

import type {
  createDiagnosticTemplateAreaSchema,
  createDiagnosticTemplateQuestionSchema,
  createDiagnosticTemplateSchema,
  diagnosticTemplateAreaParamsSchema,
  diagnosticTemplateAreaSchema,
  diagnosticTemplateParamsSchema,
  diagnosticTemplateQuestionSchema,
  diagnosticTemplateSchema,
  diagnosticTemplatesListSchema,
} from "./diagnostic-templates.schemas.js";

export type DiagnosticTemplateParams = z.infer<
  typeof diagnosticTemplateParamsSchema
>;
export type DiagnosticTemplateAreaParams = z.infer<
  typeof diagnosticTemplateAreaParamsSchema
>;
export type CreateDiagnosticTemplateInput = z.infer<
  typeof createDiagnosticTemplateSchema
>;
export type CreateDiagnosticTemplateAreaInput = z.infer<
  typeof createDiagnosticTemplateAreaSchema
>;
export type CreateDiagnosticTemplateQuestionInput = z.infer<
  typeof createDiagnosticTemplateQuestionSchema
>;
export type DiagnosticTemplateQuestion = z.infer<
  typeof diagnosticTemplateQuestionSchema
>;
export type DiagnosticTemplateArea = z.infer<typeof diagnosticTemplateAreaSchema>;
export type DiagnosticTemplate = z.infer<typeof diagnosticTemplateSchema>;
export type DiagnosticTemplatesList = z.infer<
  typeof diagnosticTemplatesListSchema
>;

export type CreateDiagnosticTemplateResult =
  | {
      status: "created";
      template: DiagnosticTemplate;
    }
  | {
      status: "template_already_exists";
    };

export type GetDiagnosticTemplateByIdResult =
  | {
      status: "found";
      template: DiagnosticTemplate;
    }
  | {
      status: "template_not_found";
    };

export type CreateDiagnosticTemplateAreaResult =
  | {
      status: "created";
      area: DiagnosticTemplateArea;
    }
  | {
      status: "template_not_found" | "area_already_exists";
    };

export type CreateDiagnosticTemplateQuestionResult =
  | {
      status: "created";
      question: DiagnosticTemplateQuestion;
    }
  | {
      status: "template_area_not_found" | "question_already_exists";
    };
