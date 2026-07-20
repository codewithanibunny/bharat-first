import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/pages - Admin only: list all pages
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
      }
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Admin pages GET error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, seoTitle, seoDesc, isPublished, layout } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const page = await prisma.page.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        seoTitle: seoTitle?.trim() || null,
        seoDesc: seoDesc?.trim() || null,
        isPublished: isPublished || false,
        layout: layout || "default",
        authorId: session.user.id,
      }
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Page creation error:", error);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
