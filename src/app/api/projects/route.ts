import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

type Visibility = "PRIVATE" | "UNLISTED" | "PUBLIC";
const isVisibility = (value: string): value is Visibility =>
  value === "PRIVATE" || value === "UNLISTED" || value === "PUBLIC";

// GET /api/projects - 獲取用戶的專案列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const visibility = searchParams.get('visibility');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 構建查詢條件
    const where: Prisma.ProjectWhereInput = {
      userId: session.user.id
    };

    if (visibility && isVisibility(visibility)) {
      where.visibility = visibility;
    }

    // 查詢專案
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          projectAssets: {
            include: {
              asset: {
                select: {
                  id: true,
                  url: true
                }
              }
            }
          }
        }
      }),
      prisma.project.count({ where })
    ]);

    const projectsWithAssets = projects.map((project) => ({
      ...project,
      assets: project.projectAssets.map((projectAsset) => projectAsset.asset),
    }));

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsWithAssets,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects - 創建新專案
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
    const { name, description, cssContent, visibility = 'PRIVATE', importedFromTemplateId, thumbnailUrl } = body;

    // 驗證必填欄位
    if (!name?.trim() || !cssContent?.trim()) {
      return NextResponse.json(
        { error: "Name and CSS content are required" },
        { status: 400 }
      );
    }

    // 生成唯一的 slug
    let slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // 檢查 slug 是否已存在
    let counter = 1;
    const originalSlug = slug;
    while (await prisma.project.findFirst({ where: { slug, userId: session.user.id } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // 創建專案
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        cssContent,
        visibility,
        slug,
        thumbnailUrl: thumbnailUrl || null,
        importedFromTemplateId: importedFromTemplateId || null,
        userId: session.user.id
      },
      include: {
        projectAssets: {
          include: {
            asset: {
              select: {
                id: true,
                url: true
              }
            }
          }
        }
      }
    });

    const projectWithAssets = {
      ...project,
      assets: project.projectAssets.map((projectAsset) => projectAsset.asset),
    };

    return NextResponse.json({
      success: true,
      data: projectWithAssets
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);

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
