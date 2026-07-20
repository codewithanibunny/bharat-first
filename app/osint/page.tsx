import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArticleCard } from '@/components/articles/ArticleCard';
import prisma from '@/lib/prisma';
import { Radar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OsintPage() {
  const osintArticles = await prisma.article.findMany({
    where: { isOSINT: true, status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-7xl">
        <div className="mb-12 border-b border-[var(--border)] pb-6">
          <h1 className="text-display flex items-center mb-4">
            <Radar size={36} className="mr-4 text-[var(--bhagwa)]" /> OSINT Directorate
          </h1>
          <p className="text-xl text-[var(--text-muted)] font-[var(--font-playfair)] max-w-3xl">
            Verified Open Source Intelligence, satellite imagery analysis, and deep-dive technical threat research.
          </p>
        </div>

        {osintArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {osintArticles.map((article) => (
              <ArticleCard key={article.id} article={article} category={article.category} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-[var(--border)] border-dashed rounded-sm bg-[var(--surface)]">
            <div className="text-[var(--text-muted)] text-sm">No intelligence reports found.</div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
