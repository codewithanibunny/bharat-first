"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6B00]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-20" />

      <div className="max-w-2xl w-full text-center space-y-10 relative z-10">
        
        <div className="flex justify-center mb-4 animate-bounce">
          <div className="w-20 h-20 bg-[#FF6B00]/10 rounded-2xl flex items-center justify-center border border-[#FF6B00]/20">
            <ShieldAlert className="w-10 h-10 text-[#FF6B00]" />
          </div>
        </div>

        <div className="space-y-4 relative">
          <h1 className="text-[12rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FF6B00] to-[#FF6B00]/20 font-[var(--font-playfair)] tracking-tighter mix-blend-screen opacity-90 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
              Asset Not Found
            </h2>
          </div>
        </div>
        
        <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
          The intelligence brief, report, or transmission you are looking for has been redacted, moved, or never existed in our database.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            themeObj={{ bg: 'bg-[#050505]', text: 'text-white', border: 'border-white/10', surfaceHover: 'bg-white/5' } as any}
            className="w-full sm:w-auto px-8 h-12 text-base transition-transform hover:scale-105"
          >
            <ArrowLeft size={18} className="mr-2" /> Retreat
          </Button>
          
          <Button 
            onClick={() => router.push('/')} 
            variant="primary" 
            themeObj={{ bg: 'bg-[#FF6B00]', text: 'text-white', border: 'border-[#FF6B00]' } as any}
            className="w-full sm:w-auto px-8 h-12 text-base shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-transform hover:scale-105"
          >
            <Home size={18} className="mr-2" /> Base Camp
          </Button>
          
          <Button 
            onClick={() => router.push('/search')} 
            variant="outline" 
            themeObj={{ bg: 'bg-[#050505]', text: 'text-white', border: 'border-white/10', surfaceHover: 'bg-white/5' } as any}
            className="w-full sm:w-auto px-8 h-12 text-base transition-transform hover:scale-105"
          >
            <Search size={18} className="mr-2" /> Intel Search
          </Button>
        </div>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-white/10" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-white/10" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-white/10" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-white/10" />
    </div>
  );
}
