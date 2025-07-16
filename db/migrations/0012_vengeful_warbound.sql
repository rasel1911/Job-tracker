CREATE TYPE "public"."job_status" AS ENUM('applied', 'in progress', 'interview', 'offer');--> statement-breakpoint
ALTER TABLE "private_jobs" RENAME COLUMN "apply_start_date" TO "status";--> statement-breakpoint
ALTER TABLE "private_jobs" ALTER COLUMN "location" DROP NOT NULL;