import { auth } from "@/auth";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/templates/[id] - 獲取單個模板
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;

    // 查詢模板
    const template = await prisma.styleTemplate.findUnique({
      where: { id: templateId },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 檢查權限：只有模板擁有者或公開模板可以查看
    if (template.visibility === 'PRIVATE' && template.createdBy !== (await auth())?.user?.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/templates/[id] - 更新模板
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: templateId } = await params;
    const body = await request.json();
    const { name, description, cssContent, categoryIds, visibility } = body;

    // 檢查模板是否存在
    const existingTemplate = await prisma.styleTemplate.findUnique({
      where: { id: templateId }
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 檢查權限：只有模板擁有者可以更新
    if (existingTemplate.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // 準備更新資料
    const updateData: Prisma.StyleTemplateUpdateInput = {};

    if (name !== undefined) {
      updateData.name = name.trim();

      // 如果名稱改變，需要更新 slug
      if (name.trim() !== existingTemplate.name) {
        let slug = name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        // 檢查 slug 是否已存在
        let counter = 1;
        const originalSlug = slug;
        while (await prisma.styleTemplate.findFirst({
          where: {
            slug,
            id: { not: templateId }
          }
        })) {
          slug = `${originalSlug}-${counter}`;
          counter++;
        }

        updateData.slug = slug;
      }
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (cssContent !== undefined) {
      updateData.cssContent = cssContent;
    }

    if (visibility !== undefined && ['PRIVATE', 'UNLISTED', 'PUBLIC'].includes(visibility)) {
      updateData.visibility = visibility;
    }

    // 更新模板
    const updatedTemplate = await prisma.styleTemplate.update({
      where: { id: templateId },
      data: {
        ...updateData,
        ...(categoryIds && {
          categories: {
            deleteMany: {}, // 先刪除所有現有關聯
            create: categoryIds.map((categoryId: string) => ({
              categoryId
            }))
          }
        })
      },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTemplate
    });

  } catch (error) {
    console.error('Error updating template:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: "Template name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id] - 刪除模板
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: templateId } = await params;

    // 檢查模板是否存在
    const existingTemplate = await prisma.styleTemplate.findUnique({
      where: { id: templateId }
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 檢查權限：只有模板擁有者可以刪除
    if (existingTemplate.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // 刪除模板（會自動刪除相關的分類關聯和互動記錄）
    await prisma.styleTemplate.delete({
      where: { id: templateId }
    });

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
