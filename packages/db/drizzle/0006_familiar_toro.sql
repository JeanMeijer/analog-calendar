ALTER TABLE "user" ALTER COLUMN "time_zone" SET DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "locale" text DEFAULT 'en-US' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "date_format" text DEFAULT 'MDY' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "week_starts_on" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "use24_hour" boolean DEFAULT false NOT NULL;
