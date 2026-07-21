import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  let articles: any[] = [];
  let categories: any[] = [];

  try {
    // Fetch all published articles
    articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, updatedAt: true },
    });

    // Fetch all categories
    categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error('Failed to fetch sitemap data from database:', error);
  }

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/article/${article.id}`,
    lastModified: article.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
