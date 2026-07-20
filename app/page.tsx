import { HomeClient } from '@/components/HomeClient';
import prisma from '@/lib/prisma';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  const [articles, shorts, categories, sections, settingsData] = await Promise.all([
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

  const features = settingsData.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

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
