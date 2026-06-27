import type { z } from "zod";

import type {
  actionPlanParamsSchema,
  actionPlanSchema,
  actionPlansListSchema,
  actionPlanStatusSchema,
  companyActionPlansParamsSchema,
  createActionPlanSchema,
  updateActionPlanSchema,
  updateActionPlanStatusSchema,
} from "./action-plans.schemas.js";

export type ActionPlanStatus = z.infer<typeof actionPlanStatusSchema>;
export type ActionPlanParams = z.infer<typeof actionPlanParamsSchema>;
export type CompanyActionPlansParams = z.infer<
  typeof companyActionPlansParamsSchema
>;
export type CreateActionPlanInput = z.infer<typeof createActionPlanSchema>;
export type UpdateActionPlanInput = z.infer<typeof updateActionPlanSchema>;
export type UpdateActionPlanStatusInput = z.infer<
  typeof updateActionPlanStatusSchema
>;
export type ActionPlan = z.infer<typeof actionPlanSchema>;
export type ActionPlansList = z.infer<typeof actionPlansListSchema>;

export type CreateActionPlanResult =
  | {
      status: "created";
      actionPlan: ActionPlan;
    }
  | {
      status: "company_not_found" | "diagnostic_not_found" | "area_not_found";
    };

export type UpdateActionPlanResult =
  | {
      status: "updated";
      actionPlan: ActionPlan;
    }
  | {
      status:
        | "action_plan_not_found"
        | "diagnostic_not_found"
        | "area_not_found";
    };
