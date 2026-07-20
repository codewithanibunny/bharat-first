"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, X } from "lucide-react";
import { useAppContext } from "@/providers/AppProvider";

export function CookieConsent() {
  const { themeObj } = useAppContext();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("bharatfirst_cookie_consent");
    if (!consent) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("bharatfirst_cookie_consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("bharatfirst_cookie_consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-[#0A0A0A]/95 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl p-6 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6 transform transition-all duration-500 translate-y-0 animate-in slide-in-from-bottom-10 fade-in">
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
          <div className="bg-[#FF6B00]/10 p-3 rounded-full flex-shrink-0">
            <ShieldCheck className="text-[#FF6B00] w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-semibold mb-1">Your Privacy Matters</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              We use cookies and advanced telemetrics to enhance your reading experience, provide personalized OSINT insights, and analyze our traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={decline}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Decline
          </button>
          <Button 
            onClick={accept} 
            variant="primary" 
            className="whitespace-nowrap px-6"
            themeObj={themeObj}
          >
            Accept Cookies
          </Button>
          <button 
            onClick={() => setShow(false)}
            className="absolute top-4 right-4 md:static md:top-auto md:right-auto text-gray-500 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
