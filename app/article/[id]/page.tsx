import { ArticleClient } from '@/components/articles/ArticleClient';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: { select: { name: true } }, author: { select: { name: true } } }
  });
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} | Bharat First`,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.imageUrl ? [{ url: article.imageUrl }] : [],
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [article, settingsData] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
      }
    }),
    prisma.setting.findMany({ where: { group: 'FEATURES' } })
  ]);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  const relatedArticles = await prisma.article.findMany({
    where: { 
      categoryId: article.categoryId,
      id: { not: article.id },
      status: 'PUBLISHED'
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { category: true }
  });


  const features = settingsData.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: article.imageUrl ? [article.imageUrl] : [],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: [{
      '@type': 'Person',
      name: article.author?.name || 'Bharat First Editorial',
      url: `${process.env.NEXTAUTH_URL}/author/${article.author?.id}`
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient 
        article={article as any} 
        category={article.category} 
        features={features} 
        relatedArticles={relatedArticles as any} 
      />
    </>
  );
}
