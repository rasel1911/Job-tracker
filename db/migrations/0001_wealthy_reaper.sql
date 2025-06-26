CREATE TABLE "private_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"apply_start_date" date NOT NULL,
	"apply_end_date" date NOT NULL,
	"circular_file" text,
	"exam_date" date,
	"note" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "government_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"apply_start_date" date NOT NULL,
	"apply_end_date" date NOT NULL,
	"circular_file" varchar(512),
	"admit_card_file" varchar(512),
	"exam_date" date,
	"note" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_information" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address" text,
	"ssc" jsonb,
	"hsc" jsonb,
	"bsc" jsonb,
	"masters" jsonb,
	"training" jsonb,
	"experience" jsonb,
	"skill" text,
	"cv" text,
	"portfolio" text,
	"image" text,
	"signature_image" text,
	"note" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "private_jobs" ADD CONSTRAINT "private_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "government_jobs" ADD CONSTRAINT "government_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_information" ADD CONSTRAINT "user_information_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;