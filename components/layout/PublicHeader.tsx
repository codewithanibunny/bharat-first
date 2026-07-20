"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Search, Sun, Moon, Terminal, Zap, ChevronDown } from 'lucide-react';
import { AshokaChakra } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useAppContext } from '@/providers/AppProvider';

export const PublicHeader = () => {
  const { theme, setTheme, themeObj } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/menus')
      .then(res => res.json())
      .then(data => {
        const mainNav = data.find((m: any) => m.location === 'HEADER');
        if (mainNav && mainNav.items) {
          // Keep hierarchical structure if the API supports it, otherwise flat
          setMenuItems(mainNav.items);
        } else {
          // Fallback if not loaded
          setMenuItems([
            { title: 'India', url: '/category/india' },
            { title: 'World', url: '/category/world' },
            { title: 'Defence', url: '/category/defence' },
            { title: 'OSINT', url: '/osint' },
            { title: 'Cyber', url: '/category/cyber' }
          ]);
        }
      })
      .catch(() => {
        // Fallback on error
        setMenuItems([
          { title: 'India', url: '/category/india' },
          { title: 'World', url: '/category/world' },
          { title: 'Defence', url: '/category/defence' },
          { title: 'OSINT', url: '/osint' }
        ]);
      });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (pathname.startsWith('/article/')) {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = (totalScroll / windowHeight).toString();
        setReadingProgress(Number(scroll));
      } else {
        setReadingProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? `${themeObj.bg} shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b ${themeObj.border}` : `bg-transparent border-b border-transparent`}`}>
      <div className="w-full h-[2px] bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
      
      {pathname.startsWith('/article/') && (
        <div className="w-full h-0.5 bg-transparent absolute top-[2px] left-0 z-50">
           <div className="h-full bg-[#FF6B00] reading-progress-bar" style={{ transform: `scaleX(${readingProgress})` }}></div>
        </div>
      )}

      <div className={`absolute inset-0 ${themeObj.bg} opacity-95 backdrop-blur-md -z-10 transition-opacity duration-500 ${scrolled ? 'opacity-95' : 'opacity-0'}`}></div>
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col">
          <div className="flex items-center justify-between h-20 border-b border-[#2E2E2E]/5 dark:border-[#FFFFFF]/5">
            <div className="flex items-center space-x-4">
              <button className={`lg:hidden p-2 ${themeObj.text}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="cursor-pointer group flex items-center space-x-3" onClick={() => router.push('/')}>
                <AshokaChakra size={28} className="text-[#000080] dark:text-[#FF6B00] hidden sm:block transform group-hover:rotate-180 transition-transform duration-1000" />
                <div className="flex flex-col justify-center mt-1">
                  <h1 className={`text-3xl font-black tracking-tighter uppercase leading-none ${themeObj.text} font-[var(--font-playfair)]`}>
                    BHARAT<span className="text-[#FF6B00] tracking-tighter ml-1">FIRST</span>
                  </h1>
                  <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${themeObj.subtle} mt-1`}>Truth · Research · Bharat First</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-full ${themeObj.text} hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors group`}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className={`p-2 rounded-full ${themeObj.text} hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors`} onClick={() => router.push('/search')}>
                <Search size={18} />
              </button>
              <Button variant="outline" themeObj={themeObj} className="hidden sm:flex border-2" onClick={() => router.push('/admin')}>
                <Terminal size={14} className="mr-2"/> SYSTEM
              </Button>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8 h-14">
             <button onClick={() => router.push('/')} className={`h-full flex items-center text-[12px] font-bold uppercase tracking-widest ${pathname === '/' ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]' : `${themeObj.text} border-b-2 border-transparent`} hover:text-[#FF6B00] transition-colors whitespace-nowrap`}>
                Home
             </button>
            {menuItems.map((item, index) => {
              const isActive = pathname === item.url;
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div 
                  key={index} 
                  className="relative h-full flex items-center group"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.title)}
                  onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                >
                  <button 
                    onClick={() => router.push(item.url)}
                    className={`h-full flex items-center text-[12px] font-bold uppercase tracking-widest ${isActive ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]' : `${themeObj.text} border-b-2 border-transparent`} hover:text-[#FF6B00] transition-colors whitespace-nowrap`}
                  >
                    {item.title}
                    {hasChildren && <ChevronDown size={14} className="ml-1 opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-transform duration-300" />}
                  </button>
                  
                  {/* Highly Polished Dropdown / Mega Menu */}
                  {hasChildren && activeDropdown === item.title && (
                    <div className={`absolute top-full left-0 mt-0 w-64 ${themeObj.bg} border ${themeObj.border} shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
                      <div className="p-2 flex flex-col">
                        {item.children.map((child: any, cIndex: number) => (
                          <button
                            key={cIndex}
                            onClick={() => { router.push(child.url); setActiveDropdown(null); }}
                            className={`text-left px-4 py-3 text-sm font-bold uppercase tracking-wider ${themeObj.text} hover:bg-[var(--surface-hover)] hover:text-[#FF6B00] transition-all rounded-sm flex items-center group/item`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] opacity-0 group-hover/item:opacity-100 mr-2 transition-opacity"></span>
                            {child.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
             <button onClick={() => router.push('/shorts')} className={`h-full flex items-center text-[12px] font-black uppercase tracking-widest transition-colors ${pathname.startsWith('/shorts') ? 'text-[#FF6B00]' : themeObj.text} hover:text-[#FF6B00] ml-auto`}>
              <Zap size={14} className="mr-2 text-[#FF6B00]"/> INTELLIGENCE SHORTS
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`lg:hidden fixed inset-0 top-20 ${themeObj.bg} z-40 overflow-y-auto animate-in slide-in-from-left duration-300`}>
          <div className="flex flex-col px-6 py-8 space-y-6">
             <button onClick={() => { router.push('/'); setIsMenuOpen(false); }} className={`text-left text-lg font-black uppercase tracking-widest ${pathname === '/' ? 'text-[#FF6B00]' : themeObj.text}`}>Home</button>
             {menuItems.map((item, index) => (
               <div key={index} className="flex flex-col space-y-4">
                 <button 
                   onClick={() => { router.push(item.url); setIsMenuOpen(false); }}
                   className={`text-left text-lg font-black uppercase tracking-widest ${pathname === item.url ? 'text-[#FF6B00]' : themeObj.text}`}
                 >
                   {item.title}
                 </button>
                 {item.children && item.children.length > 0 && (
                   <div className="pl-6 flex flex-col space-y-4 border-l-2 border-[#FF6B00]/20">
                     {item.children.map((child: any, cIndex: number) => (
                       <button
                         key={cIndex}
                         onClick={() => { router.push(child.url); setIsMenuOpen(false); }}
                         className={`text-left text-sm font-bold uppercase tracking-wider ${pathname === child.url ? 'text-[#FF6B00]' : themeObj.muted}`}
                       >
                         {child.title}
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             ))}
             <button onClick={() => { router.push('/shorts'); setIsMenuOpen(false); }} className={`text-left text-lg font-black uppercase tracking-widest flex items-center ${pathname.startsWith('/shorts') ? 'text-[#FF6B00]' : themeObj.text}`}>
               <Zap size={20} className="mr-3 text-[#FF6B00]"/> SHORTS
             </button>
          </div>
        </div>
      )}
    </header>
  );
};
