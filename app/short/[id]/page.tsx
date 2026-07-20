import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Clock, MapPin, Share2, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function ShortDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const short = await prisma.shortNews.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!short) {
    notFound();
  }

  // Get theme dynamically (Simplified for server component)
  const settings = await prisma.setting.findMany({ where: { group: 'THEME' } });
  const getSetting = (k: string, defaultVal: string) => settings.find(s => s.key === k)?.value || defaultVal;
  const secondaryColor = getSetting('secondary_color', '#0D0D0D');
  const primaryColor = getSetting('primary_color', '#FF6B00');

  const customThemeCSS = `
    :root {
      --bhagwa: ${primaryColor};
      --accent: ${primaryColor};
    }
    html[data-theme="dark"] {
      --background: ${secondaryColor};
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customThemeCSS }} />
      <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] flex flex-col">
        <PublicHeader />
        
        <main className="flex-grow container mx-auto px-4 lg:px-8 py-12 max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-[#FF6B00] text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                {short.type}
              </span>
              {short.priority === 'HIGH' && (
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider flex items-center animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> FLASH
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" themeObj={{ bg: 'bg-[#0D0D0D]', text: 'text-white', border: 'border-white/10' } as any} className="h-8 w-8 p-0 border-white/10 hover:bg-white/5">
                <Share2 size={14} />
              </Button>
              <Button variant="outline" themeObj={{ bg: 'bg-[#0D0D0D]', text: 'text-white', border: 'border-white/10' } as any} className="h-8 w-8 p-0 border-white/10 hover:bg-white/5">
                <BookmarkPlus size={14} />
              </Button>
            </div>
          </div>

          <h1 className="text-3xl font-black font-[var(--font-playfair)] mb-6 leading-tight">
            {short.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-8 pb-8 border-b border-white/10 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-[#FF6B00]" />
              {short.location || 'New Delhi'}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-[#FF6B00]" />
              {new Date(short.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="max-w-none mb-12 text-lg text-[var(--foreground)] opacity-90 leading-relaxed font-[var(--font-inter)]">
            <p>{short.summary}</p>
          </div>
          
        </main>
        
        <PublicFooter />
      </div>
    </>
  );
}
