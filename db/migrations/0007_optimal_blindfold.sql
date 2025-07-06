CREATE TABLE "academic" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"degree" varchar(100) NOT NULL,
	"institution" varchar(150) NOT NULL,
	"subject" varchar(100),
	"field" varchar(100),
	"start_year" integer,
	"end_year" integer,
	"grade" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company" varchar(150) NOT NULL,
	"title" varchar(100) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "skill" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"proficiency" varchar(50)
);
