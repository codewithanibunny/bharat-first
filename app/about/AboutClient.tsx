"use client";
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useAppContext } from '@/providers/AppProvider';

export function AboutClient() {
  const { themeObj } = useAppContext();
  return (
    <div className={`min-h-screen ${themeObj.bg} ${themeObj.text} flex flex-col`}>
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-4xl">
        <h1 className="text-4xl font-black mb-6 uppercase tracking-widest font-[var(--font-playfair)] text-[#FF6B00]">About Bharat First</h1>
        <div className={`space-y-6 ${themeObj.muted} leading-relaxed`}>
          <p>Bharat First is India's premier independent OSINT, defence, cybersecurity, and geopolitical research platform. We are dedicated to bringing truth and rigorous research to the forefront.</p>
          <p>Our mission is to provide comprehensive, unbiased, and deeply analyzed intelligence on matters of national security, global geopolitics, and emerging technologies.</p>
          <p>Truth. Research. Bharat First.</p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
