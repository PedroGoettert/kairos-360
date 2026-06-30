CREATE TYPE "public"."baseline_diagnostic_status" AS ENUM('draft', 'completed');--> statement-breakpoint
CREATE TABLE "baseline_diagnostic_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diagnostic_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "baseline_diagnostic_answers_score_range_check" CHECK ("baseline_diagnostic_answers"."score" >= 0 AND "baseline_diagnostic_answers"."score" <= 10)
);
--> statement-breakpoint
CREATE TABLE "baseline_diagnostic_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diagnostic_id" uuid NOT NULL,
	"area_id" uuid NOT NULL,
	"score" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "baseline_diagnostics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_by_user_id" text NOT NULL,
	"title" text,
	"notes" text,
	"status" "baseline_diagnostic_status" DEFAULT 'draft' NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_baseline_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"template_area_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"display_order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_baseline_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_area_id" uuid NOT NULL,
	"template_question_id" uuid,
	"question" text NOT NULL,
	"description" text,
	"display_order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "baseline_diagnostic_answers" ADD CONSTRAINT "baseline_diagnostic_answers_diagnostic_id_baseline_diagnostics_id_fk" FOREIGN KEY ("diagnostic_id") REFERENCES "public"."baseline_diagnostics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baseline_diagnostic_answers" ADD CONSTRAINT "baseline_diagnostic_answers_question_id_organization_baseline_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."organization_baseline_questions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baseline_diagnostic_scores" ADD CONSTRAINT "baseline_diagnostic_scores_diagnostic_id_baseline_diagnostics_id_fk" FOREIGN KEY ("diagnostic_id") REFERENCES "public"."baseline_diagnostics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baseline_diagnostic_scores" ADD CONSTRAINT "baseline_diagnostic_scores_area_id_organization_baseline_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."organization_baseline_areas"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baseline_diagnostics" ADD CONSTRAINT "baseline_diagnostics_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baseline_diagnostics" ADD CONSTRAINT "baseline_diagnostics_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_baseline_areas" ADD CONSTRAINT "organization_baseline_areas_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_baseline_areas" ADD CONSTRAINT "organization_baseline_areas_template_area_id_diagnostic_template_areas_id_fk" FOREIGN KEY ("template_area_id") REFERENCES "public"."diagnostic_template_areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_baseline_questions" ADD CONSTRAINT "organization_baseline_questions_organization_area_id_organization_baseline_areas_id_fk" FOREIGN KEY ("organization_area_id") REFERENCES "public"."organization_baseline_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_baseline_questions" ADD CONSTRAINT "organization_baseline_questions_template_question_id_diagnostic_template_questions_id_fk" FOREIGN KEY ("template_question_id") REFERENCES "public"."diagnostic_template_questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "baseline_diagnostic_answers_diagnostic_id_idx" ON "baseline_diagnostic_answers" USING btree ("diagnostic_id");--> statement-breakpoint
CREATE INDEX "baseline_diagnostic_answers_question_id_idx" ON "baseline_diagnostic_answers" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "baseline_diagnostic_answers_diagnostic_question_idx" ON "baseline_diagnostic_answers" USING btree ("diagnostic_id","question_id");--> statement-breakpoint
CREATE INDEX "baseline_diagnostic_scores_diagnostic_id_idx" ON "baseline_diagnostic_scores" USING btree ("diagnostic_id");--> statement-breakpoint
CREATE INDEX "baseline_diagnostic_scores_area_id_idx" ON "baseline_diagnostic_scores" USING btree ("area_id");--> statement-breakpoint
CREATE UNIQUE INDEX "baseline_diagnostic_scores_diagnostic_area_idx" ON "baseline_diagnostic_scores" USING btree ("diagnostic_id","area_id");--> statement-breakpoint
CREATE INDEX "baseline_diagnostics_organization_id_idx" ON "baseline_diagnostics" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "baseline_diagnostics_created_by_user_id_idx" ON "baseline_diagnostics" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "baseline_diagnostics_status_idx" ON "baseline_diagnostics" USING btree ("status");--> statement-breakpoint
CREATE INDEX "organization_baseline_areas_organization_id_idx" ON "organization_baseline_areas" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_baseline_areas_display_order_idx" ON "organization_baseline_areas" USING btree ("display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_baseline_areas_org_slug_idx" ON "organization_baseline_areas" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "organization_baseline_questions_area_id_idx" ON "organization_baseline_questions" USING btree ("organization_area_id");--> statement-breakpoint
CREATE INDEX "organization_baseline_questions_display_order_idx" ON "organization_baseline_questions" USING btree ("display_order");