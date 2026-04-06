/*
  Warnings:

  - You are about to drop the column `is_public` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `style_templates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `style_templates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `style_templates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PRIVATE', 'UNLISTED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "public"."StorageProvider" AS ENUM ('SUPABASE', 'R2', 'S3');

-- CreateEnum
CREATE TYPE "public"."TargetType" AS ENUM ('PROJECT', 'TEMPLATE');

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "is_public",
ADD COLUMN     "fork_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imported_from_template_id" TEXT,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "thumbnail_url" TEXT,
ADD COLUMN     "visibility" "public"."Visibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "public"."style_templates" DROP COLUMN "likes",
ADD COLUMN     "fork_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "thumbnail_url" TEXT,
ADD COLUMN     "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE "public"."assets" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "project_id" TEXT,
    "template_id" TEXT,
    "provider" "public"."StorageProvider" NOT NULL DEFAULT 'SUPABASE',
    "bucket" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mime" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "dominant_color" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stars" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "targetType" "public"."TargetType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "targetType" "public"."TargetType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assets_owner_id_idx" ON "public"."assets"("owner_id");

-- CreateIndex
CREATE INDEX "assets_project_id_idx" ON "public"."assets"("project_id");

-- CreateIndex
CREATE INDEX "assets_template_id_idx" ON "public"."assets"("template_id");

-- CreateIndex
CREATE INDEX "assets_is_public_idx" ON "public"."assets"("is_public");

-- CreateIndex
CREATE INDEX "stars_targetType_target_id_idx" ON "public"."stars"("targetType", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "stars_user_id_targetType_target_id_key" ON "public"."stars"("user_id", "targetType", "target_id");

-- CreateIndex
CREATE INDEX "likes_targetType_target_id_idx" ON "public"."likes"("targetType", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_targetType_target_id_key" ON "public"."likes"("user_id", "targetType", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "public"."projects"("slug");

-- CreateIndex
CREATE INDEX "projects_user_id_idx" ON "public"."projects"("user_id");

-- CreateIndex
CREATE INDEX "projects_visibility_idx" ON "public"."projects"("visibility");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "public"."projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "style_templates_slug_key" ON "public"."style_templates"("slug");

-- CreateIndex
CREATE INDEX "style_templates_created_by_idx" ON "public"."style_templates"("created_by");

-- CreateIndex
CREATE INDEX "style_templates_visibility_idx" ON "public"."style_templates"("visibility");

-- CreateIndex
CREATE INDEX "style_templates_is_official_idx" ON "public"."style_templates"("is_official");

-- CreateIndex
CREATE INDEX "style_templates_slug_idx" ON "public"."style_templates"("slug");

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_imported_from_template_id_fkey" FOREIGN KEY ("imported_from_template_id") REFERENCES "public"."style_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."style_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stars" ADD CONSTRAINT "stars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
