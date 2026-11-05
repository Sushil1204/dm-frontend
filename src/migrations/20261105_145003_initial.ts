import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_page_type" AS ENUM('standard', 'legal');
  CREATE TYPE "public"."enum_material_categories_accent" AS ENUM('green', 'purple', 'orange', 'yellow', 'navy');
  CREATE TYPE "public"."enum_resources_resource_type" AS ENUM('brochure', 'technical-note', 'tds', 'sds', 'certificate', 'case-study');
  CREATE TYPE "public"."enum_resources_visibility" AS ENUM('public', 'private');
  CREATE TYPE "public"."enum_enquiries_enquiry_type" AS ENUM('contact', 'quote');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'reviewing', 'replied', 'closed');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_theme_settings_preset" AS ENUM('navy', 'teal');
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"page_type" "enum_pages_page_type" DEFAULT 'standard' NOT NULL,
  	"intro" varchar,
  	"content" jsonb,
  	"published" boolean DEFAULT true,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar DEFAULT 'Industrial material photograph' NOT NULL,
  	"caption" varchar,
  	"usage_note" varchar,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "material_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"accent" "enum_material_categories_accent" DEFAULT 'green' NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "materials_characteristics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "materials_grades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "materials_technical_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"unit" varchar,
  	"disclaimer" varchar
  );
  
  CREATE TABLE "materials_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "materials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"category_id" integer NOT NULL,
  	"summary" varchar NOT NULL,
  	"description" jsonb,
  	"card_image_id" integer,
  	"hero_image_id" integer,
  	"processing_notes" varchar,
  	"datasheet_id" integer,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "materials_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"applications_id" integer
  );
  
  CREATE TABLE "applications_typical_components" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"short_description" varchar NOT NULL,
  	"overview" jsonb,
  	"card_image_id" integer,
  	"hero_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"resource_type" "enum_resources_resource_type" DEFAULT 'technical-note' NOT NULL,
  	"thumbnail_id" integer,
  	"publish_date" timestamp(3) with time zone NOT NULL,
  	"visibility" "enum_resources_visibility" DEFAULT 'public' NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "resources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"materials_id" integer,
  	"applications_id" integer
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enquiry_type" "enum_enquiries_enquiry_type" DEFAULT 'contact' NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new' NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"phone" varchar,
  	"country" varchar,
  	"subject" varchar,
  	"message" varchar,
  	"material_id" integer,
  	"application_id" integer,
  	"processing_method" varchar,
  	"specification" varchar,
  	"annual_volume" varchar,
  	"attachment_id" integer,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"internal_notes" varchar,
  	"source_path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "attachments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enquiry_reference" varchar,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"media_id" integer,
  	"material_categories_id" integer,
  	"materials_id" integer,
  	"applications_id" integer,
  	"resources_id" integer,
  	"enquiries_id" integer,
  	"attachments_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'Daman Plastics' NOT NULL,
  	"tagline" varchar DEFAULT 'Reliable Quality, Global Trust' NOT NULL,
  	"logo_id" integer,
  	"contact_email" varchar NOT NULL,
  	"contact_phone" varchar,
  	"contact_address" varchar,
  	"contact_hours" varchar,
  	"footer_description" varchar DEFAULT 'Polymer compounding partner developing application-focused material solutions for manufacturing teams.',
  	"copyright_text" varchar,
  	"demo_notice" boolean DEFAULT true,
  	"announcement_enabled" boolean DEFAULT false,
  	"announcement_message" varchar,
  	"announcement_cta_label" varchar,
  	"announcement_cta_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_settings_nav_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "header_settings_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "header_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar DEFAULT 'Request a Quote',
  	"cta_url" varchar DEFAULT '/request-a-quote',
  	"sticky" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_settings_hero_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "homepage_settings_sections_capability_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "homepage_settings_sections_compounding_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_settings_sections_process_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_settings_sections_quality_section_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "homepage_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Engineered polymer materials',
  	"hero_headline" varchar DEFAULT 'Materials engineered around your manufacturing needs.' NOT NULL,
  	"hero_body" varchar DEFAULT 'Application-focused polymer compounds, developed with process consistency and technical collaboration in mind.',
  	"hero_primary_cta_label" varchar DEFAULT 'Explore Materials',
  	"hero_primary_cta_url" varchar DEFAULT '/materials',
  	"hero_secondary_cta_label" varchar DEFAULT 'Discuss Your Requirement',
  	"hero_secondary_cta_url" varchar DEFAULT '/contact',
  	"hero_video_id" integer,
  	"hero_mobile_video_id" integer,
  	"hero_poster_id" integer,
  	"hero_video_settings_autoplay" boolean DEFAULT true,
  	"hero_video_settings_loop" boolean DEFAULT true,
  	"sections_intro_eyebrow" varchar DEFAULT 'Who we are',
  	"sections_intro_heading" varchar NOT NULL,
  	"sections_intro_body" varchar,
  	"sections_intro_image_id" integer,
  	"sections_intro_link_label" varchar DEFAULT 'About the company',
  	"sections_intro_link_url" varchar DEFAULT '/company',
  	"sections_materials_section_eyebrow" varchar DEFAULT 'Material portfolio',
  	"sections_materials_section_heading" varchar NOT NULL,
  	"sections_materials_section_body" varchar,
  	"sections_materials_section_link_label" varchar DEFAULT 'View all materials',
  	"sections_materials_section_link_url" varchar DEFAULT '/materials',
  	"sections_applications_section_eyebrow" varchar DEFAULT 'Application sectors',
  	"sections_applications_section_heading" varchar NOT NULL,
  	"sections_applications_section_body" varchar,
  	"sections_compounding_eyebrow" varchar DEFAULT 'Custom compounding',
  	"sections_compounding_heading" varchar NOT NULL,
  	"sections_compounding_body" varchar,
  	"sections_compounding_cta_label" varchar DEFAULT 'Discuss your specification',
  	"sections_compounding_cta_url" varchar DEFAULT '/request-a-quote',
  	"sections_process_section_eyebrow" varchar DEFAULT 'How we work',
  	"sections_process_section_heading" varchar NOT NULL,
  	"sections_process_section_body" varchar,
  	"sections_process_section_link_label" varchar DEFAULT 'Manufacturing & quality',
  	"sections_process_section_link_url" varchar DEFAULT '/manufacturing-quality',
  	"sections_quality_section_eyebrow" varchar DEFAULT 'Quality',
  	"sections_quality_section_heading" varchar NOT NULL,
  	"sections_quality_section_body" varchar,
  	"sections_quality_section_image_id" integer,
  	"sections_quality_section_link_label" varchar DEFAULT 'Quality workflow',
  	"sections_quality_section_link_url" varchar DEFAULT '/manufacturing-quality',
  	"sections_resources_section_eyebrow" varchar DEFAULT 'Resources',
  	"sections_resources_section_heading" varchar NOT NULL,
  	"sections_resources_section_body" varchar,
  	"sections_resources_section_cta_label" varchar DEFAULT 'Browse the resource library',
  	"sections_resources_section_cta_url" varchar DEFAULT '/resources',
  	"sections_resources_section_request_note" varchar DEFAULT 'Technical documents can also be requested directly.',
  	"sections_closing_cta_heading" varchar DEFAULT 'Have a material requirement to solve?',
  	"sections_closing_cta_body" varchar,
  	"sections_closing_cta_primary_label" varchar DEFAULT 'Request a quote',
  	"sections_closing_cta_primary_url" varchar DEFAULT '/request-a-quote',
  	"sections_closing_cta_secondary_label" varchar DEFAULT 'Contact us',
  	"sections_closing_cta_secondary_url" varchar DEFAULT '/contact',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"materials_id" integer,
  	"applications_id" integer,
  	"resources_id" integer
  );
  
  CREATE TABLE "theme_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"preset" "enum_theme_settings_preset" DEFAULT 'navy' NOT NULL,
  	"accent_override_enabled" boolean DEFAULT false,
  	"accent_override_accent" varchar,
  	"accent_override_primary" varchar,
  	"accent_override_background" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_title" varchar DEFAULT 'Daman Plastics — Engineered polymer compounds',
  	"title_template" varchar DEFAULT '%s | Daman Plastics',
  	"default_description" varchar,
  	"social_image_id" integer,
  	"canonical_url" varchar,
  	"noindex" boolean DEFAULT true,
  	"organization_schema" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "company_settings_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "company_settings_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "company_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar DEFAULT 'An engineering-led compounding partner',
  	"intro" varchar,
  	"story" jsonb,
  	"image_id" integer,
  	"milestone_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "manufacturing_settings_process_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"detail" varchar
  );
  
  CREATE TABLE "manufacturing_settings_quality_workflow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "manufacturing_settings_test_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"verified" boolean DEFAULT false
  );
  
  CREATE TABLE "manufacturing_settings_equipment" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "manufacturing_settings_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"issuer" varchar,
  	"file_id" integer,
  	"verified" boolean DEFAULT false
  );
  
  CREATE TABLE "manufacturing_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar DEFAULT 'Process control from intake to dispatch',
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "materials_characteristics" ADD CONSTRAINT "materials_characteristics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "materials_grades" ADD CONSTRAINT "materials_grades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "materials_technical_data" ADD CONSTRAINT "materials_technical_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "materials_standards" ADD CONSTRAINT "materials_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "materials" ADD CONSTRAINT "materials_category_id_material_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."material_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "materials" ADD CONSTRAINT "materials_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "materials" ADD CONSTRAINT "materials_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "materials" ADD CONSTRAINT "materials_datasheet_id_resources_id_fk" FOREIGN KEY ("datasheet_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "materials_rels" ADD CONSTRAINT "materials_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "materials_rels" ADD CONSTRAINT "materials_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_typical_components" ADD CONSTRAINT "applications_typical_components_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_materials_fk" FOREIGN KEY ("materials_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_attachment_id_attachments_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_material_categories_fk" FOREIGN KEY ("material_categories_id") REFERENCES "public"."material_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_materials_fk" FOREIGN KEY ("materials_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attachments_fk" FOREIGN KEY ("attachments_id") REFERENCES "public"."attachments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_settings_nav_items_children" ADD CONSTRAINT "header_settings_nav_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_settings_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_settings_nav_items" ADD CONSTRAINT "header_settings_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_hero_proof_points" ADD CONSTRAINT "homepage_settings_hero_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_sections_capability_strip_items" ADD CONSTRAINT "homepage_settings_sections_capability_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_sections_compounding_steps" ADD CONSTRAINT "homepage_settings_sections_compounding_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_sections_process_section_steps" ADD CONSTRAINT "homepage_settings_sections_process_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_sections_quality_section_points" ADD CONSTRAINT "homepage_settings_sections_quality_section_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings" ADD CONSTRAINT "homepage_settings_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings" ADD CONSTRAINT "homepage_settings_hero_mobile_video_id_media_id_fk" FOREIGN KEY ("hero_mobile_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings" ADD CONSTRAINT "homepage_settings_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings" ADD CONSTRAINT "homepage_settings_sections_intro_image_id_media_id_fk" FOREIGN KEY ("sections_intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings" ADD CONSTRAINT "homepage_settings_sections_quality_section_image_id_media_id_fk" FOREIGN KEY ("sections_quality_section_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_materials_fk" FOREIGN KEY ("materials_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_settings" ADD CONSTRAINT "seo_settings_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_settings_principles" ADD CONSTRAINT "company_settings_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_settings_capabilities" ADD CONSTRAINT "company_settings_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "manufacturing_settings_process_stages" ADD CONSTRAINT "manufacturing_settings_process_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_settings_quality_workflow" ADD CONSTRAINT "manufacturing_settings_quality_workflow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_settings_test_capabilities" ADD CONSTRAINT "manufacturing_settings_test_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_settings_equipment" ADD CONSTRAINT "manufacturing_settings_equipment_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "manufacturing_settings_equipment" ADD CONSTRAINT "manufacturing_settings_equipment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_settings_certifications" ADD CONSTRAINT "manufacturing_settings_certifications_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "manufacturing_settings_certifications" ADD CONSTRAINT "manufacturing_settings_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "material_categories_slug_idx" ON "material_categories" USING btree ("slug");
  CREATE INDEX "material_categories_updated_at_idx" ON "material_categories" USING btree ("updated_at");
  CREATE INDEX "material_categories_created_at_idx" ON "material_categories" USING btree ("created_at");
  CREATE INDEX "materials_characteristics_order_idx" ON "materials_characteristics" USING btree ("_order");
  CREATE INDEX "materials_characteristics_parent_id_idx" ON "materials_characteristics" USING btree ("_parent_id");
  CREATE INDEX "materials_grades_order_idx" ON "materials_grades" USING btree ("_order");
  CREATE INDEX "materials_grades_parent_id_idx" ON "materials_grades" USING btree ("_parent_id");
  CREATE INDEX "materials_technical_data_order_idx" ON "materials_technical_data" USING btree ("_order");
  CREATE INDEX "materials_technical_data_parent_id_idx" ON "materials_technical_data" USING btree ("_parent_id");
  CREATE INDEX "materials_standards_order_idx" ON "materials_standards" USING btree ("_order");
  CREATE INDEX "materials_standards_parent_id_idx" ON "materials_standards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "materials_slug_idx" ON "materials" USING btree ("slug");
  CREATE INDEX "materials_category_idx" ON "materials" USING btree ("category_id");
  CREATE INDEX "materials_card_image_idx" ON "materials" USING btree ("card_image_id");
  CREATE INDEX "materials_hero_image_idx" ON "materials" USING btree ("hero_image_id");
  CREATE INDEX "materials_datasheet_idx" ON "materials" USING btree ("datasheet_id");
  CREATE INDEX "materials_updated_at_idx" ON "materials" USING btree ("updated_at");
  CREATE INDEX "materials_created_at_idx" ON "materials" USING btree ("created_at");
  CREATE INDEX "materials_rels_order_idx" ON "materials_rels" USING btree ("order");
  CREATE INDEX "materials_rels_parent_idx" ON "materials_rels" USING btree ("parent_id");
  CREATE INDEX "materials_rels_path_idx" ON "materials_rels" USING btree ("path");
  CREATE INDEX "materials_rels_applications_id_idx" ON "materials_rels" USING btree ("applications_id");
  CREATE INDEX "applications_typical_components_order_idx" ON "applications_typical_components" USING btree ("_order");
  CREATE INDEX "applications_typical_components_parent_id_idx" ON "applications_typical_components" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "applications_slug_idx" ON "applications" USING btree ("slug");
  CREATE INDEX "applications_card_image_idx" ON "applications" USING btree ("card_image_id");
  CREATE INDEX "applications_hero_image_idx" ON "applications" USING btree ("hero_image_id");
  CREATE INDEX "applications_updated_at_idx" ON "applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");
  CREATE INDEX "resources_thumbnail_idx" ON "resources" USING btree ("thumbnail_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE UNIQUE INDEX "resources_filename_idx" ON "resources" USING btree ("filename");
  CREATE INDEX "resources_rels_order_idx" ON "resources_rels" USING btree ("order");
  CREATE INDEX "resources_rels_parent_idx" ON "resources_rels" USING btree ("parent_id");
  CREATE INDEX "resources_rels_path_idx" ON "resources_rels" USING btree ("path");
  CREATE INDEX "resources_rels_materials_id_idx" ON "resources_rels" USING btree ("materials_id");
  CREATE INDEX "resources_rels_applications_id_idx" ON "resources_rels" USING btree ("applications_id");
  CREATE INDEX "enquiries_material_idx" ON "enquiries" USING btree ("material_id");
  CREATE INDEX "enquiries_application_idx" ON "enquiries" USING btree ("application_id");
  CREATE INDEX "enquiries_attachment_idx" ON "enquiries" USING btree ("attachment_id");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "attachments_updated_at_idx" ON "attachments" USING btree ("updated_at");
  CREATE INDEX "attachments_created_at_idx" ON "attachments" USING btree ("created_at");
  CREATE UNIQUE INDEX "attachments_filename_idx" ON "attachments" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_material_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("material_categories_id");
  CREATE INDEX "payload_locked_documents_rels_materials_id_idx" ON "payload_locked_documents_rels" USING btree ("materials_id");
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("applications_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_attachments_id_idx" ON "payload_locked_documents_rels" USING btree ("attachments_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "header_settings_nav_items_children_order_idx" ON "header_settings_nav_items_children" USING btree ("_order");
  CREATE INDEX "header_settings_nav_items_children_parent_id_idx" ON "header_settings_nav_items_children" USING btree ("_parent_id");
  CREATE INDEX "header_settings_nav_items_order_idx" ON "header_settings_nav_items" USING btree ("_order");
  CREATE INDEX "header_settings_nav_items_parent_id_idx" ON "header_settings_nav_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_settings_hero_proof_points_order_idx" ON "homepage_settings_hero_proof_points" USING btree ("_order");
  CREATE INDEX "homepage_settings_hero_proof_points_parent_id_idx" ON "homepage_settings_hero_proof_points" USING btree ("_parent_id");
  CREATE INDEX "homepage_settings_sections_capability_strip_items_order_idx" ON "homepage_settings_sections_capability_strip_items" USING btree ("_order");
  CREATE INDEX "homepage_settings_sections_capability_strip_items_parent_id_idx" ON "homepage_settings_sections_capability_strip_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_settings_sections_compounding_steps_order_idx" ON "homepage_settings_sections_compounding_steps" USING btree ("_order");
  CREATE INDEX "homepage_settings_sections_compounding_steps_parent_id_idx" ON "homepage_settings_sections_compounding_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_settings_sections_process_section_steps_order_idx" ON "homepage_settings_sections_process_section_steps" USING btree ("_order");
  CREATE INDEX "homepage_settings_sections_process_section_steps_parent_id_idx" ON "homepage_settings_sections_process_section_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_settings_sections_quality_section_points_order_idx" ON "homepage_settings_sections_quality_section_points" USING btree ("_order");
  CREATE INDEX "homepage_settings_sections_quality_section_points_parent_id_idx" ON "homepage_settings_sections_quality_section_points" USING btree ("_parent_id");
  CREATE INDEX "homepage_settings_hero_hero_video_idx" ON "homepage_settings" USING btree ("hero_video_id");
  CREATE INDEX "homepage_settings_hero_hero_mobile_video_idx" ON "homepage_settings" USING btree ("hero_mobile_video_id");
  CREATE INDEX "homepage_settings_hero_hero_poster_idx" ON "homepage_settings" USING btree ("hero_poster_id");
  CREATE INDEX "homepage_settings_sections_intro_sections_intro_image_idx" ON "homepage_settings" USING btree ("sections_intro_image_id");
  CREATE INDEX "homepage_settings_sections_quality_section_sections_qual_idx" ON "homepage_settings" USING btree ("sections_quality_section_image_id");
  CREATE INDEX "homepage_settings_rels_order_idx" ON "homepage_settings_rels" USING btree ("order");
  CREATE INDEX "homepage_settings_rels_parent_idx" ON "homepage_settings_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_settings_rels_path_idx" ON "homepage_settings_rels" USING btree ("path");
  CREATE INDEX "homepage_settings_rels_materials_id_idx" ON "homepage_settings_rels" USING btree ("materials_id");
  CREATE INDEX "homepage_settings_rels_applications_id_idx" ON "homepage_settings_rels" USING btree ("applications_id");
  CREATE INDEX "homepage_settings_rels_resources_id_idx" ON "homepage_settings_rels" USING btree ("resources_id");
  CREATE INDEX "seo_settings_social_image_idx" ON "seo_settings" USING btree ("social_image_id");
  CREATE INDEX "company_settings_principles_order_idx" ON "company_settings_principles" USING btree ("_order");
  CREATE INDEX "company_settings_principles_parent_id_idx" ON "company_settings_principles" USING btree ("_parent_id");
  CREATE INDEX "company_settings_capabilities_order_idx" ON "company_settings_capabilities" USING btree ("_order");
  CREATE INDEX "company_settings_capabilities_parent_id_idx" ON "company_settings_capabilities" USING btree ("_parent_id");
  CREATE INDEX "company_settings_image_idx" ON "company_settings" USING btree ("image_id");
  CREATE INDEX "manufacturing_settings_process_stages_order_idx" ON "manufacturing_settings_process_stages" USING btree ("_order");
  CREATE INDEX "manufacturing_settings_process_stages_parent_id_idx" ON "manufacturing_settings_process_stages" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_settings_quality_workflow_order_idx" ON "manufacturing_settings_quality_workflow" USING btree ("_order");
  CREATE INDEX "manufacturing_settings_quality_workflow_parent_id_idx" ON "manufacturing_settings_quality_workflow" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_settings_test_capabilities_order_idx" ON "manufacturing_settings_test_capabilities" USING btree ("_order");
  CREATE INDEX "manufacturing_settings_test_capabilities_parent_id_idx" ON "manufacturing_settings_test_capabilities" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_settings_equipment_order_idx" ON "manufacturing_settings_equipment" USING btree ("_order");
  CREATE INDEX "manufacturing_settings_equipment_parent_id_idx" ON "manufacturing_settings_equipment" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_settings_equipment_image_idx" ON "manufacturing_settings_equipment" USING btree ("image_id");
  CREATE INDEX "manufacturing_settings_certifications_order_idx" ON "manufacturing_settings_certifications" USING btree ("_order");
  CREATE INDEX "manufacturing_settings_certifications_parent_id_idx" ON "manufacturing_settings_certifications" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_settings_certifications_file_idx" ON "manufacturing_settings_certifications" USING btree ("file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "material_categories" CASCADE;
  DROP TABLE "materials_characteristics" CASCADE;
  DROP TABLE "materials_grades" CASCADE;
  DROP TABLE "materials_technical_data" CASCADE;
  DROP TABLE "materials_standards" CASCADE;
  DROP TABLE "materials" CASCADE;
  DROP TABLE "materials_rels" CASCADE;
  DROP TABLE "applications_typical_components" CASCADE;
  DROP TABLE "applications" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_rels" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "attachments" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "header_settings_nav_items_children" CASCADE;
  DROP TABLE "header_settings_nav_items" CASCADE;
  DROP TABLE "header_settings" CASCADE;
  DROP TABLE "homepage_settings_hero_proof_points" CASCADE;
  DROP TABLE "homepage_settings_sections_capability_strip_items" CASCADE;
  DROP TABLE "homepage_settings_sections_compounding_steps" CASCADE;
  DROP TABLE "homepage_settings_sections_process_section_steps" CASCADE;
  DROP TABLE "homepage_settings_sections_quality_section_points" CASCADE;
  DROP TABLE "homepage_settings" CASCADE;
  DROP TABLE "homepage_settings_rels" CASCADE;
  DROP TABLE "theme_settings" CASCADE;
  DROP TABLE "seo_settings" CASCADE;
  DROP TABLE "company_settings_principles" CASCADE;
  DROP TABLE "company_settings_capabilities" CASCADE;
  DROP TABLE "company_settings" CASCADE;
  DROP TABLE "manufacturing_settings_process_stages" CASCADE;
  DROP TABLE "manufacturing_settings_quality_workflow" CASCADE;
  DROP TABLE "manufacturing_settings_test_capabilities" CASCADE;
  DROP TABLE "manufacturing_settings_equipment" CASCADE;
  DROP TABLE "manufacturing_settings_certifications" CASCADE;
  DROP TABLE "manufacturing_settings" CASCADE;
  DROP TYPE "public"."enum_pages_page_type";
  DROP TYPE "public"."enum_material_categories_accent";
  DROP TYPE "public"."enum_resources_resource_type";
  DROP TYPE "public"."enum_resources_visibility";
  DROP TYPE "public"."enum_enquiries_enquiry_type";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_theme_settings_preset";`)
}
