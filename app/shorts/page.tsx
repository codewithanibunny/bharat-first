import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ShortsCard } from '@/components/shorts/ShortsCard';
import prisma from '@/lib/prisma';
import { Zap } from 'lucide-react';
import { THEMES } from '@/constants/theme';

export const dynamic = 'force-dynamic';

export default async function ShortsPage() {
  const shorts = await prisma.shortNews.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Pages use the dark theme by default, or we can use the provider. 
  // For SSR pages, we just use the global CSS variables.
  
  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-7xl">
        <div className="mb-12 border-b border-[var(--border)] pb-6">
          <h1 className="text-display flex items-center mb-4">
            <Zap size={32} className="mr-4 text-[var(--bhagwa)]" /> Intelligence Shorts
          </h1>
          <p className="text-xl text-[var(--text-muted)] font-[var(--font-playfair)] max-w-3xl">
            Real-time signals intelligence (SIGINT), situational alerts, and rapid-fire geopolitical updates.
          </p>
        </div>

        {shorts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shorts.map((short) => (
              <ShortsCard key={short.id} short={short} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-[var(--border)] border-dashed rounded-sm bg-[var(--surface)]">
            <div className="text-[var(--text-muted)] text-sm">No signals detected in database.</div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
