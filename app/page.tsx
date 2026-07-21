import { HomeClient } from '@/components/HomeClient';
import prisma from '@/lib/prisma';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  let articles: any[] = [];
  let shorts: any[] = [];
  let categories: any[] = [];
  let sections: any[] = [];
  let features: Record<string, string> = {};

  try {
    const [articlesData, shortsData, categoriesData, sectionsData, settingsData] = await Promise.all([
      prisma.article.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.shortNews.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.category.findMany(),
      prisma.pageSection.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.setting.findMany({
        where: { group: 'FEATURES' }
      })
    ]);

    articles = articlesData;
    shorts = shortsData;
    categories = categoriesData;
    sections = sectionsData;
    features = settingsData.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error('Failed to fetch home page data from database at build time:', error);
  }

  return (
    <HomeClient 
      articles={articles} 
      shorts={shorts} 
      categories={categories} 
      sections={sections}
      features={features}
    />
  );
}
