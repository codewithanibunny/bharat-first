import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/articles/[id] - Public: get single published article
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id, status: 'PUBLISHED' },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true, likes: true, views: true } }
      }
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Article GET error:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
