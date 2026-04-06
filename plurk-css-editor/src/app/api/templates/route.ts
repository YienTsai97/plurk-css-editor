import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/templates - 獲取模板列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isOfficial = searchParams.get('isOfficial');
    const visibility = searchParams.get('visibility');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {};

    if (categoryId) {
      where.categories = {
        some: {
          categoryId
        }
      };
    }

    if (isOfficial !== null) {
      where.isOfficial = isOfficial === 'true';
    }

    if (visibility && ['PRIVATE', 'UNLISTED', 'PUBLIC'].includes(visibility)) {
      where.visibility = visibility;
    }

    // 查詢模板
    const [templates, total] = await Promise.all([
      prisma.styleTemplate.findMany({
        where,
        orderBy: [
          { isOfficial: 'desc' },
          { likeCount: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit,
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
      }),
      prisma.styleTemplate.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        templates,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/templates - 創建新模板
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
    const { name, description, cssContent, categoryIds, visibility = 'PUBLIC' } = body;

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
    let originalSlug = slug;
    while (await prisma.styleTemplate.findFirst({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // 創建模板
    const template = await prisma.styleTemplate.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        cssContent,
        visibility,
        slug,
        createdBy: session.user.id,
        categories: categoryIds && categoryIds.length > 0 ? {
          create: categoryIds.map((categoryId: string) => ({
            categoryId
          }))
        } : undefined
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
      data: template
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating template:', error);

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
