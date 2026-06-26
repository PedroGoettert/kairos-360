CREATE TYPE "public"."diagnostic_status" AS ENUM('draft', 'completed');--> statement-breakpoint
CREATE TABLE "company_diagnostic_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
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
CREATE TABLE "company_diagnostic_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_area_id" uuid NOT NULL,
	"template_question_id" uuid,
	"question" text NOT NULL,
	"description" text,
	"display_order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostic_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diagnostic_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "diagnostic_answers_score_range_check" CHECK ("diagnostic_answers"."score" >= 0 AND "diagnostic_answers"."score" <= 10)
);
--> statement-breakpoint
CREATE TABLE "diagnostic_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diagnostic_id" uuid NOT NULL,
	"area_id" uuid NOT NULL,
	"score" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostic_template_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostic_template_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_area_id" uuid NOT NULL,
	"question" text NOT NULL,
	"description" text,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostic_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"created_by_user_id" text NOT NULL,
	"title" text,
	"notes" text,
	"status" "diagnostic_status" DEFAULT 'draft' NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_diagnostic_areas" ADD CONSTRAINT "company_diagnostic_areas_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_diagnostic_areas" ADD CONSTRAINT "company_diagnostic_areas_template_area_id_diagnostic_template_areas_id_fk" FOREIGN KEY ("template_area_id") REFERENCES "public"."diagnostic_template_areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_diagnostic_questions" ADD CONSTRAINT "company_diagnostic_questions_company_area_id_company_diagnostic_areas_id_fk" FOREIGN KEY ("company_area_id") REFERENCES "public"."company_diagnostic_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_diagnostic_questions" ADD CONSTRAINT "company_diagnostic_questions_template_question_id_diagnostic_template_questions_id_fk" FOREIGN KEY ("template_question_id") REFERENCES "public"."diagnostic_template_questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_answers" ADD CONSTRAINT "diagnostic_answers_diagnostic_id_diagnostics_id_fk" FOREIGN KEY ("diagnostic_id") REFERENCES "public"."diagnostics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_answers" ADD CONSTRAINT "diagnostic_answers_question_id_company_diagnostic_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."company_diagnostic_questions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_scores" ADD CONSTRAINT "diagnostic_scores_diagnostic_id_diagnostics_id_fk" FOREIGN KEY ("diagnostic_id") REFERENCES "public"."diagnostics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_scores" ADD CONSTRAINT "diagnostic_scores_area_id_company_diagnostic_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."company_diagnostic_areas"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_template_areas" ADD CONSTRAINT "diagnostic_template_areas_template_id_diagnostic_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."diagnostic_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_template_questions" ADD CONSTRAINT "diagnostic_template_questions_template_area_id_diagnostic_template_areas_id_fk" FOREIGN KEY ("template_area_id") REFERENCES "public"."diagnostic_template_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostics" ADD CONSTRAINT "diagnostics_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostics" ADD CONSTRAINT "diagnostics_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_diagnostic_areas_company_id_idx" ON "company_diagnostic_areas" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_diagnostic_areas_display_order_idx" ON "company_diagnostic_areas" USING btree ("display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "company_diagnostic_areas_company_slug_idx" ON "company_diagnostic_areas" USING btree ("company_id","slug");--> statement-breakpoint
CREATE INDEX "company_diagnostic_questions_area_id_idx" ON "company_diagnostic_questions" USING btree ("company_area_id");--> statement-breakpoint
CREATE INDEX "company_diagnostic_questions_display_order_idx" ON "company_diagnostic_questions" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "diagnostic_answers_diagnostic_id_idx" ON "diagnostic_answers" USING btree ("diagnostic_id");--> statement-breakpoint
CREATE INDEX "diagnostic_answers_question_id_idx" ON "diagnostic_answers" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_answers_diagnostic_question_idx" ON "diagnostic_answers" USING btree ("diagnostic_id","question_id");--> statement-breakpoint
CREATE INDEX "diagnostic_scores_diagnostic_id_idx" ON "diagnostic_scores" USING btree ("diagnostic_id");--> statement-breakpoint
CREATE INDEX "diagnostic_scores_area_id_idx" ON "diagnostic_scores" USING btree ("area_id");--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_scores_diagnostic_area_idx" ON "diagnostic_scores" USING btree ("diagnostic_id","area_id");--> statement-breakpoint
CREATE INDEX "diagnostic_template_areas_template_id_idx" ON "diagnostic_template_areas" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "diagnostic_template_areas_display_order_idx" ON "diagnostic_template_areas" USING btree ("display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_template_areas_template_slug_idx" ON "diagnostic_template_areas" USING btree ("template_id","slug");--> statement-breakpoint
CREATE INDEX "diagnostic_template_questions_area_id_idx" ON "diagnostic_template_questions" USING btree ("template_area_id");--> statement-breakpoint
CREATE INDEX "diagnostic_template_questions_display_order_idx" ON "diagnostic_template_questions" USING btree ("display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_templates_slug_idx" ON "diagnostic_templates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "diagnostic_templates_name_idx" ON "diagnostic_templates" USING btree ("name");--> statement-breakpoint
CREATE INDEX "diagnostics_company_id_idx" ON "diagnostics" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "diagnostics_created_by_user_id_idx" ON "diagnostics" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "diagnostics_status_idx" ON "diagnostics" USING btree ("status");