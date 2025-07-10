CREATE TABLE "job_vacancies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" integer NOT NULL,
	"org_name" varchar(255) NOT NULL,
	"org_id" integer,
	"job_title" varchar(255) NOT NULL,
	"job_title_bn" varchar(255) NOT NULL,
	"job_vacancy" text,
	"apply_last_date" timestamp,
	"apply_start_date" timestamp,
	"url_link" varchar(255),
	"file_link" json,
	"comment" json,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "job_vacancies_id_unique" UNIQUE("id"),
	CONSTRAINT "job_vacancies_job_id_unique" UNIQUE("job_id")
);
