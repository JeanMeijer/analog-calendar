CREATE TABLE "calendar" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"time_zone" text,
	"primary" boolean DEFAULT false NOT NULL,
	"color" text,
	"sync_token" text,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"start" timestamp with time zone NOT NULL,
	"start_time_zone" text,
	"end" timestamp with time zone NOT NULL,
	"end_time_zone" text,
	"all_day" boolean DEFAULT false,
	"location" text,
	"status" text,
	"url" text,
	"sync_token" text,
	"calendar_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "default_calendar_id" text;--> statement-breakpoint
ALTER TABLE "calendar" ADD CONSTRAINT "calendar_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "calendar_account_idx" ON "calendar" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "event_account_idx" ON "event" USING btree ("account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "event_account_calendar_idx" ON "event" USING btree ("account_id","calendar_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_default_account_id_account_id_fk" FOREIGN KEY ("default_account_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_default_calendar_id_account_id_fk" FOREIGN KEY ("default_calendar_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;