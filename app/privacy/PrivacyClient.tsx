"use client";
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useAppContext } from '@/providers/AppProvider';

export function PrivacyClient({ content }: { content?: string }) {
  const { themeObj } = useAppContext();
  return (
    <div className={`min-h-screen ${themeObj.bg} ${themeObj.text} flex flex-col`}>
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-32 pb-20 max-w-4xl">
        <h1 className="text-4xl font-black mb-6 uppercase tracking-widest font-[var(--font-playfair)] text-[#FF6B00]">Privacy Policy</h1>
        <div className={`space-y-6 ${themeObj.muted} leading-relaxed whitespace-pre-wrap`}>
          {content || "Your privacy is critically important to us.\n\nAt Bharat First, we have a few fundamental principles:\nWe don't ask you for personal information unless we truly need it.\nWe don't share your personal information with anyone except to comply with the law, develop our products, or protect our rights.\nWe don't store personal information on our servers unless required for the on-going operation of our services."}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
