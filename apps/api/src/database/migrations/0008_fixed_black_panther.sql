CREATE TYPE "public"."manual_metric_category" AS ENUM('marketing', 'sales', 'finance', 'operations', 'customer_service', 'hr', 'management');--> statement-breakpoint
CREATE TABLE "manual_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_by_user_id" text NOT NULL,
	"category" "manual_metric_category" NOT NULL,
	"metric_key" text NOT NULL,
	"metric_label" text NOT NULL,
	"value" double precision NOT NULL,
	"unit" text,
	"reference_date" date NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "manual_metrics" ADD CONSTRAINT "manual_metrics_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manual_metrics" ADD CONSTRAINT "manual_metrics_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "manual_metrics_organization_id_idx" ON "manual_metrics" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "manual_metrics_created_by_user_id_idx" ON "manual_metrics" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "manual_metrics_category_idx" ON "manual_metrics" USING btree ("category");--> statement-breakpoint
CREATE INDEX "manual_metrics_metric_key_idx" ON "manual_metrics" USING btree ("metric_key");--> statement-breakpoint
CREATE INDEX "manual_metrics_reference_date_idx" ON "manual_metrics" USING btree ("reference_date");