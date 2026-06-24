CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" text NOT NULL,
	"name" text NOT NULL,
	"trade_name" text,
	"document" text,
	"industry" text,
	"website" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "companies_owner_user_id_idx" ON "companies" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "companies_name_idx" ON "companies" USING btree ("name");