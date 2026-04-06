import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/projects/[id] - 獲取單個專案
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const projectId = params.id;

    // 查詢專案
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        assets: {
          select: {
            id: true,
            url: true,
          }
        },
        importedFromTemplate: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // 檢查權限：只有專案擁有者或公開專案可以查看
    if (project.userId !== session?.user?.id && project.visibility === 'PRIVATE') {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - 更新專案
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projectId = params.id;
    const body = await request.json();
    const { name, description, cssContent, visibility, thumbnailUrl } = body;

    // 檢查專案是否存在
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // 檢查權限：只有專案擁有者可以更新
    if (existingProject.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // 準備更新資料
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name.trim();

      // 如果名稱改變，需要更新 slug
      if (name.trim() !== existingProject.name) {
        let slug = name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        // 檢查 slug 是否已存在
        let counter = 1;
        let originalSlug = slug;
        while (await prisma.project.findFirst({
          where: {
            slug,
            userId: session.user.id,
            id: { not: projectId }
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

    if (thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = thumbnailUrl;
    }

    // 更新專案
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        assets: {
          select: {
            id: true,
            url: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: "Project name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - 刪除專案
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projectId = params.id;

    // 檢查專案是否存在
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // 檢查權限：只有專案擁有者可以刪除
    if (existingProject.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // 刪除專案（會自動刪除相關的 assets 和 likes/stars）
    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
