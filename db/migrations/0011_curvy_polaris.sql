CREATE TABLE "public_add_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"org_name" varchar(255) NOT NULL,
	"org_name_bn" varchar(255),
	"file_link" text NOT NULL,
	"apply_last_date" timestamp with time zone,
	"comment" text,
	"apply_link" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
