/*
  Warnings:

  - You are about to drop the column `category` on the `style_templates` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `style_templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."style_templates" DROP COLUMN "category",
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."template_categories" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "style_template_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "template_categories_style_template_id_category_id_key" ON "public"."template_categories"("style_template_id", "category_id");

-- AddForeignKey
ALTER TABLE "public"."template_categories" ADD CONSTRAINT "template_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."template_categories" ADD CONSTRAINT "template_categories_style_template_id_fkey" FOREIGN KEY ("style_template_id") REFERENCES "public"."style_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."style_templates" ADD CONSTRAINT "style_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
