import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AuthorClient from './AuthorClient';

export const dynamic = 'force-dynamic';

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const author = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    select: { id: true, name: true, image: true, role: true, createdAt: true }
  });

  if (!author) {
    notFound();
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where: { 
        authorId: author.id,
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
        authorId: author.id,
        status: 'PUBLISHED'
      }
    })
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-7xl">
        <div className="mb-14 flex items-center gap-8 border-b border-[var(--border)] pb-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--border)] shadow-[0_0_25px_rgba(0,0,0,0.1)] shrink-0">
            <img 
              src={author.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name || 'Author')}&background=random`}
              alt={author.name || 'Author'}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-widest mb-2 font-[var(--font-playfair)] text-[var(--foreground)]">
              {author.name}
            </h1>
            <p className="text-lg font-bold uppercase tracking-widest text-[#FF6B00] mb-4">
              {author.role === 'ADMIN' ? 'Editor in Chief' : author.role === 'AUTHOR' ? 'Senior Correspondent' : 'Contributor'}
            </p>
            <p className="text-sm font-medium text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Covering geopolitics, defense, and strategic affairs for Bharat First. 
              Delivering accurate intelligence and comprehensive analysis. Member since {new Date(author.createdAt).getFullYear()}.
            </p>
          </div>
        </div>

        <AuthorClient author={author} initialArticles={articles} totalCount={totalCount} />
      </main>

      <PublicFooter />
    </div>
  );
}
