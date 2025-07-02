ALTER TABLE "private_jobs" ADD COLUMN "status" "job_status" DEFAULT 'applied';--> statement-breakpoint
ALTER TABLE "government_jobs" ADD COLUMN "status" "job_status" DEFAULT 'applied';