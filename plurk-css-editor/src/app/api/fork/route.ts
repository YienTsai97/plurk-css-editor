import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// POST /api/fork - 從模板或專案創建新專案
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetType, targetId, name, description, visibility = 'PRIVATE' } = body;

    // 驗證必填欄位
    if (!targetType || !targetId || !name?.trim()) {
      return NextResponse.json(
        { error: "Target type, target ID, and name are required" },
        { status: 400 }
      );
    }

    if (!['PROJECT', 'TEMPLATE'].includes(targetType)) {
      return NextResponse.json(
        { error: "Invalid target type" },
        { status: 400 }
      );
    }

    let sourceContent: string;
    let sourceName: string;

    // 根據目標類型獲取內容
    if (targetType === 'TEMPLATE') {
      const template = await prisma.styleTemplate.findUnique({
        where: { id: targetId }
      });

      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      // 檢查權限
      if (template.visibility === 'PRIVATE' && template.createdBy !== session.user.id) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }

      sourceContent = template.cssContent;
      sourceName = template.name;
    } else {
      const project = await prisma.project.findUnique({
        where: { id: targetId }
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      // 檢查權限
      if (project.visibility === 'PRIVATE' && project.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }

      sourceContent = project.cssContent;
      sourceName = project.name;
    }

    // 生成唯一的 slug
    let slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // 檢查 slug 是否已存在
    let counter = 1;
    let originalSlug = slug;
    while (await prisma.project.findFirst({ where: { slug, userId: session.user.id } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // 創建新專案
    const newProject = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        cssContent: sourceContent,
        visibility,
        slug,
        userId: session.user.id,
        importedFromTemplateId: targetType === 'TEMPLATE' ? targetId : null
      }
    });

    // 更新來源的 fork 計數
    if (targetType === 'TEMPLATE') {
      await prisma.styleTemplate.update({
        where: { id: targetId },
        data: {
          forkCount: {
            increment: 1
          }
        }
      });
    } else {
      await prisma.project.update({
        where: { id: targetId },
        data: {
          forkCount: {
            increment: 1
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        project: newProject,
        message: `Successfully forked from ${targetType.toLowerCase()} "${sourceName}"`
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error forking:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
