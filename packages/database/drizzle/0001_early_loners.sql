CREATE TYPE "public"."metric_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."metric_type" AS ENUM('ENERGY', 'WATER', 'WASTE', 'CARBON');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('SENSOR', 'MANUAL', 'API');--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_id" uuid NOT NULL,
	"severity" "severity" NOT NULL,
	"message" text NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "source_type" NOT NULL,
	"location" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thresholds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"metric_type" "metric_type" NOT NULL,
	"max_value" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "metrics" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "metrics" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "source_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "created_by" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "type" "metric_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "raw_value" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "calculated_value" double precision;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "unit" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "status" "metric_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "timestamp" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_metric_id_metrics_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thresholds" ADD CONSTRAINT "thresholds_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thresholds" ADD CONSTRAINT "thresholds_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "metrics" DROP COLUMN "value";--> statement-breakpoint
ALTER TABLE "metrics" DROP COLUMN "created_at";