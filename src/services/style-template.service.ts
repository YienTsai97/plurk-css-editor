import { prisma } from "@/lib/db";
import { ApiResponse } from "@/types/api.type";
import { CreateStyleTemplate, StyleTemplateType, StyleTemplateWithoutCss, UpdateStyleTemplate } from "@/types/style-template.type";

//Get all style templates
export const getAllStyleTemplates = async (): Promise<ApiResponse<StyleTemplateWithoutCss[]>> => {
  try {
    const styleTemplates = await prisma.styleTemplate.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isOfficial: true,
        likeCount: true,
        forkCount: true,
        slug: true,
        thumbnailUrl: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
      }
    });
    return { success: true, data: styleTemplates };
  } catch (error) {
    console.error("Error fetching style templates:", error);
    return { success: false, error };
  }
}

//Get style template by Category
export const getStyleTemplateByCategory = async (categoryIds: string[]): Promise<ApiResponse<StyleTemplateWithoutCss[]>> => {
  try {
    const styleTemplates = await prisma.styleTemplate.findMany({
      where: {
        categories: {
          some: {
            categoryId: {
              in: categoryIds
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        isOfficial: true,
        likeCount: true,
        forkCount: true,
        slug: true,
        thumbnailUrl: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
      }
    });
    return { success: true, data: styleTemplates };
  } catch (error) {
    console.error("Error fetching style templates by category:", error);
    return { success: false, error };
  }
}

//Get full data of selected style template by Id
export const getStyleTemplateById = async (id: string): Promise<ApiResponse<StyleTemplateType>> => {
  try {
    const selectedTemplate = await prisma.styleTemplate.findUnique({
      where: { id },
    });
    if (!selectedTemplate) {
      return { success: false, error: "Style template not found" };
    }
    return { success: true, data: selectedTemplate };
  } catch (error) {
    console.error("Error fetching style template by id:", error);
    return { success: false, error };
  }
}

//Create style template
export const createStyleTemplate = async (data: CreateStyleTemplate): Promise<ApiResponse<StyleTemplateType>> => {
  try {
    const { categoryIds, ...rest } = data;
    const newStyleTemplate = await prisma.styleTemplate.create({
      data: {
        ...rest,
        ...(categoryIds && categoryIds.length > 0 && {
          categories: {
            create: categoryIds.map(categoryId => ({
              categoryId,
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    return { success: true, data: newStyleTemplate };
  } catch (error) {
    console.error("Error creating style template:", error);
    return { success: false, error };
  }
}

//Update style template
export const updateStyleTemplate = async (id: string, data: UpdateStyleTemplate): Promise<ApiResponse<StyleTemplateType>> => {
  try {
    const { categoryIds, ...rest } = data;
    const updatedStyleTemplate = await prisma.styleTemplate.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryIds && {
          categories: {
            deleteMany: {}, // 先刪除所有現有關聯
            create: categoryIds.map(categoryId => ({
              categoryId,
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })
    return { success: true, data: updatedStyleTemplate };
  } catch (error) {
    console.error("Error updating style template:", error);
    return { success: false, error };
  }
}

//Get official style templates
export const getOfficialStyleTemplates = async (): Promise<ApiResponse<StyleTemplateWithoutCss[]>> => {
  try {
    const getOfficialStyleTemplates = await prisma.styleTemplate.findMany({
      where: { isOfficial: true },
      select: {
        id: true,
        name: true,
        description: true,
        isOfficial: true,
        likeCount: true,
        forkCount: true,
        slug: true,
        thumbnailUrl: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
      }
    })
    return { success: true, data: getOfficialStyleTemplates }
  } catch (error) {
    console.error("Error getting official Template:", error)
    return { success: false, error }
  }
}