CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"is_spend" boolean NOT NULL,
	"payment_type_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	"removed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "total_amount" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_amount" integer NOT NULL,
	"last_amount" integer,
	"created_at" timestamp DEFAULT now(),
	"last_spend" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"removed_at" timestamp,
	CONSTRAINT "payment_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"color" varchar(255),
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"removed_at" timestamp,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_type_id_payment_type_id_fk" FOREIGN KEY ("payment_type_id") REFERENCES "public"."payment_type"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "total_amount" ADD CONSTRAINT "total_amount_last_spend_transactions_id_fk" FOREIGN KEY ("last_spend") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE cascade;