"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10 bg-[#0A0A0A]/80 p-12 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
        
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertOctagon className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-[var(--font-playfair)]">
            System Malfunction
          </h1>
          <p className="text-gray-400 text-lg">
            We encountered an unexpected anomaly while retrieving the requested data.
          </p>
        </div>
        
        <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-left inline-block max-w-full overflow-hidden">
          <p className="text-sm font-mono text-red-400/80 break-words">
            <span className="text-gray-500 select-none">ERROR_LOG &gt; </span>
            {error.message || "An unknown error occurred"}
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-gray-600 mt-2">
              DIGEST: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={() => reset()} 
            variant="primary" 
            themeObj={{ bg: 'bg-white', text: 'text-black', border: 'border-white' } as any}
            className="w-full sm:w-auto px-8 h-12 text-base transition-transform hover:scale-105"
          >
            <RotateCcw size={18} className="mr-2" /> Re-initialize
          </Button>
          
          <Button 
            onClick={() => router.push('/')} 
            variant="outline" 
            themeObj={{ bg: 'bg-transparent', text: 'text-white', border: 'border-white/20', surfaceHover: 'bg-white/5' } as any}
            className="w-full sm:w-auto px-8 h-12 text-base transition-transform hover:scale-105"
          >
            <Home size={18} className="mr-2" /> Return to Base
          </Button>
        </div>
      </div>
    </div>
  );
}
