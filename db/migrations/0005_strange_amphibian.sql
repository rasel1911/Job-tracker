CREATE TYPE "public"."file_type" AS ENUM('cv_file', 'photo', 'others_file');--> statement-breakpoint
ALTER TABLE "user_files" ADD COLUMN "type" "file_type" NOT NULL;