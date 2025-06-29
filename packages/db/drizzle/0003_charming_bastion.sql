ALTER TABLE "account" ALTER COLUMN "name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "email" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "email" DROP NOT NULL;