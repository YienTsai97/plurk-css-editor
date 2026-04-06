import { StyleTemplateCategory as PrismaStyleTemplateCategory } from "@/generated/prisma";

export type StyleTemplateCategory = PrismaStyleTemplateCategory;
export type CreateStyleTemplateCategory = Omit<StyleTemplateCategory, 'id' | 'createdAt' | 'styleTemplate' | 'category'>;