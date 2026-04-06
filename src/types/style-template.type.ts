import { StyleTemplate as PrismaStyleTemplate } from "@/generated/prisma";

export type StyleTemplateType = PrismaStyleTemplate;
export type CreateStyleTemplate = Omit<StyleTemplateType, 'id' | 'createdAt' | 'updatedAt' | 'createdByUser' | 'likes' | 'categories'> & {
  categoryIds?: string[];
};
export type UpdateStyleTemplate = Partial<Omit<StyleTemplateType, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByUser' | 'likes' | 'categories'>> & {
  categoryIds?: string[];
};
export type StyleTemplateWithoutCss = Omit<StyleTemplateType, 'cssContent'>;