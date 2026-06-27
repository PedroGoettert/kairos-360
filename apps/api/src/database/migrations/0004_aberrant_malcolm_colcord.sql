CREATE TYPE "public"."action_plan_status" AS ENUM('not_started', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."report_format" AS ENUM('pdf', 'excel');--> statement-breakpoint
CREATE TYPE "public"."report_kind" AS ENUM('manual_diagnostic');--> statement-breakpoint
CREATE TABLE "action_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"created_by_user_id" text NOT NULL,
	"diagnostic_id" uuid,
	"area_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"responsible" text,
	"due_date" timestamp,
	"status" "action_plan_status" DEFAULT 'not_started' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"diagnostic_id" uuid,
	"created_by_user_id" text NOT NULL,
	"kind" "report_kind" DEFAULT 'manual_diagnostic' NOT NULL,
	"format" "report_format" NOT NULL,
	"title" text NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "action_plans" ADD CONSTRAINT "action_plans_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_plans" ADD CONSTRAINT "action_plans_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_plans" ADD CONSTRAINT "action_plans_diagnostic_id_diagnostics_id_fk" FOREIGN KEY ("diagnostic_id") REFERENCES "public"."diagnostics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_plans" ADD CONSTRAINT "action_plans_area_id_company_diagnostic_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."company_diagnostic_areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_diagnostic_id_diagnostics_id_fk" FOREIGN KEY ("diagnostic_id") REFERENCES "public"."diagnostics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_plans_company_id_idx" ON "action_plans" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "action_plans_created_by_user_id_idx" ON "action_plans" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "action_plans_diagnostic_id_idx" ON "action_plans" USING btree ("diagnostic_id");--> statement-breakpoint
CREATE INDEX "action_plans_area_id_idx" ON "action_plans" USING btree ("area_id");--> statement-breakpoint
CREATE INDEX "action_plans_status_idx" ON "action_plans" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reports_company_id_idx" ON "reports" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "reports_diagnostic_id_idx" ON "reports" USING btree ("diagnostic_id");--> statement-breakpoint
CREATE INDEX "reports_created_by_user_id_idx" ON "reports" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "reports_format_idx" ON "reports" USING btree ("format");