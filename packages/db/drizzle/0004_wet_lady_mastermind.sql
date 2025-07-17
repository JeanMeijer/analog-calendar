ALTER TABLE "user" DROP CONSTRAINT "user_default_calendar_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "calendar" ADD COLUMN "calendar_id" text NOT NULL;