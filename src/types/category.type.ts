import { StyleTemplateCategory as PrismaStyleTemplateCategory } from "@/generated/prisma";

export type Category = PrismaStyleTemplateCategory;
export type CreateCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'styleTemplates'>;
export type UpdateCategory = Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'styleTemplates'>>;