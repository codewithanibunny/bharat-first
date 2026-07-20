import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    const categoryId = searchParams.get('category')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ articles: [], shorts: [], query: '' });
    }

    const articleWhere: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ],
    };

    const shortWhere: any = {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
      ],
    };

    if (categoryId) {
      articleWhere.categoryId = categoryId;
      shortWhere.categoryId = categoryId;
    }

    const [articles, shorts] = await Promise.all([
      prisma.article.findMany({
        where: articleWhere,
        take: 20,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { name: true, image: true } },
          _count: { select: { views: true, comments: true } },
        },
      }),
      prisma.shortNews.findMany({
        where: shortWhere,
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({ articles, shorts, query: q });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
