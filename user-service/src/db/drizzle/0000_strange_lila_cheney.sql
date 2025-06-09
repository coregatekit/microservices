-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "schema_migrations" (
	"version" bigint PRIMARY KEY NOT NULL,
	"dirty" boolean NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email" text_ops);
*/