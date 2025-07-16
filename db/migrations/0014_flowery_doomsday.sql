ALTER TABLE "job_vacancies" DROP CONSTRAINT "job_vacancies_id_unique";--> statement-breakpoint
ALTER TABLE "job_vacancies" ALTER COLUMN "job_title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_vacancies" ALTER COLUMN "job_title_bn" DROP NOT NULL;