/*
  Warnings:

  - You are about to drop the column `dominant_color` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `template_id` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `assets` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."StorageProvider" ADD VALUE 'EXTERNAL';

-- DropForeignKey
ALTER TABLE "public"."assets" DROP CONSTRAINT "assets_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."assets" DROP CONSTRAINT "assets_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."assets" DROP CONSTRAINT "assets_template_id_fkey";

-- DropIndex
DROP INDEX "public"."assets_is_public_idx";

-- DropIndex
DROP INDEX "public"."assets_owner_id_idx";

-- DropIndex
DROP INDEX "public"."assets_project_id_idx";

-- DropIndex
DROP INDEX "public"."assets_template_id_idx";

-- AlterTable
ALTER TABLE "public"."assets" DROP COLUMN "dominant_color",
DROP COLUMN "height",
DROP COLUMN "is_public",
DROP COLUMN "owner_id",
DROP COLUMN "project_id",
DROP COLUMN "template_id",
DROP COLUMN "width",
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "bucket" DROP NOT NULL,
ALTER COLUMN "key" DROP NOT NULL,
ALTER COLUMN "size" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."project_assets" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."style_template_assets" (
    "id" TEXT NOT NULL,
    "style_template_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_template_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_assets_asset_id_idx" ON "public"."project_assets"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_assets_project_id_asset_id_key" ON "public"."project_assets"("project_id", "asset_id");

-- CreateIndex
CREATE INDEX "style_template_assets_asset_id_idx" ON "public"."style_template_assets"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "style_template_assets_style_template_id_asset_id_key" ON "public"."style_template_assets"("style_template_id", "asset_id");

-- CreateIndex
CREATE INDEX "assets_user_id_idx" ON "public"."assets"("user_id");

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_assets" ADD CONSTRAINT "project_assets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_assets" ADD CONSTRAINT "project_assets_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."style_template_assets" ADD CONSTRAINT "style_template_assets_style_template_id_fkey" FOREIGN KEY ("style_template_id") REFERENCES "public"."style_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."style_template_assets" ADD CONSTRAINT "style_template_assets_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
