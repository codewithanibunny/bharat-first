import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!category) {
    notFound();
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where: { 
        categoryId: category.id,
        status: 'PUBLISHED'
      },
      take: 12,
      orderBy: { publishedAt: 'desc' },
      include: { 
        category: true,
        author: { select: { name: true, image: true } },
        _count: { select: { comments: true, likes: true } }
      }
    }),
    prisma.article.count({
      where: {
        categoryId: category.id,
        status: 'PUBLISHED'
      }
    })
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-7xl">
        <CategoryClient category={category} initialArticles={articles} totalCount={totalCount} />
      </main>

      <PublicFooter />
    </div>
  );
}

