"use client";
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useAppContext } from '@/providers/AppProvider';

export function TermsClient({ content }: { content?: string }) {
  const { themeObj } = useAppContext();
  return (
    <div className={`min-h-screen ${themeObj.bg} ${themeObj.text} flex flex-col`}>
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-4xl">
        <h1 className="text-4xl font-black mb-6 uppercase tracking-widest font-[var(--font-playfair)] text-[#FF6B00]">Terms of Service</h1>
        <div className={`space-y-6 ${themeObj.muted} leading-relaxed whitespace-pre-wrap`}>
          {content || "By accessing or using the Bharat First platform, you agree to be bound by these Terms of Service.\n\nAll content published on Bharat First is for informational purposes only. We reserve the right to modify or replace these terms at any time. Your continued use of the platform after any such changes constitutes your acceptance of the new terms."}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
