CREATE TYPE "public"."organization_user_role" AS ENUM('owner', 'admin', 'manager', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."organization_user_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TABLE "organization_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "organization_user_role" DEFAULT 'viewer' NOT NULL,
	"status" "organization_user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by_user_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"trade_name" text,
	"document" text,
	"industry" text,
	"website" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "organization_users_organization_id_idx" ON "organization_users" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_users_user_id_idx" ON "organization_users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "organization_users_role_idx" ON "organization_users" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_users_org_user_idx" ON "organization_users" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "organizations_created_by_user_id_idx" ON "organizations" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "organizations_name_idx" ON "organizations" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_slug_idx" ON "organizations" USING btree ("slug");