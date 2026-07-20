import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/articles - Admin only: list all articles
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true, likes: true, views: true } }
      }
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Admin articles GET error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST /api/admin/articles - Create new article
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, categoryId, status, breaking, featured, isOSINT, imageUrl, readTime } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        categoryId: categoryId || null,
        authorId: session.user.id,
        status: status || 'DRAFT',
        breaking: breaking || false,
        featured: featured || false,
        isOSINT: isOSINT || false,
        imageUrl: imageUrl?.trim() || null,
        readTime: readTime || Math.ceil(content.split(' ').length / 200),
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
      include: { author: { select: { name: true } }, category: true }
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Article creation error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
