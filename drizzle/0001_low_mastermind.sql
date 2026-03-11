CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" text NOT NULL,
	"lead_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"sender" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "role" text DEFAULT 'agent';