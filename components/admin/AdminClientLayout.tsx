"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, FileText, Zap, Layers, Megaphone, Bell, BarChart3, Users, Sliders, CheckCircle2, LogOut, Database, Tag, Home, BookOpen, Globe } from 'lucide-react';
import { AshokaChakra, IndiaMapWatermark } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { useAppContext } from '@/providers/AppProvider';
import { useSession, signOut } from 'next-auth/react';

export function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const { themeObj } = useAppContext();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const adminModules = [
    { group: 'Content', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', route: '/admin' },
      { id: 'articles', icon: FileText, label: 'Articles', route: '/admin/articles' },
      { id: 'shorts', icon: Zap, label: 'Intelligence Shorts', route: '/admin/shorts' },
      { id: 'categories', icon: Layers, label: 'Categories', route: '/admin/categories' },
      { id: 'tags', icon: Tag, label: 'Tags', route: '/admin/tags' },
    ]},
    { group: 'Website', items: [
      { id: 'homepage', icon: Home, label: 'Homepage Builder', route: '/admin/homepage' },
      { id: 'menus', icon: Globe, label: 'Menu Builder', route: '/admin/menus' },
      { id: 'pages', icon: BookOpen, label: 'Pages', route: '/admin/pages' },
    ]},
    { group: 'Marketing', items: [
      { id: 'ads', icon: Megaphone, label: 'Advertisements', route: '/admin/advertisements' },
      { id: 'subscribers', icon: Bell, label: 'Subscribers', route: '/admin/subscribers' },
    ]},
    { group: 'System', items: [
      { id: 'users', icon: Users, label: 'Users & Access', route: '/admin/users' },
      { id: 'settings', icon: Sliders, label: 'Configuration', route: '/admin/settings' },
    ]}
  ];

  const allItems = adminModules.flatMap(m => m.items);
  const activeItem = allItems.find(i => i.route !== '/admin' ? pathname.startsWith(i.route) : pathname === i.route);
  const pageTitle = activeItem?.label || 'Admin Panel';

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className={`min-h-screen ${themeObj.bg} flex font-sans ${themeObj.text}`}>
      {/* Sidebar */}
      <aside className={`w-64 ${themeObj.surface} border-r ${themeObj.border} flex flex-col fixed h-full z-20 overflow-hidden`}>
        <div className="w-full h-[2px] bg-[#FF6B00]" />
        
        {/* Logo */}
        <div
          className={`h-16 flex flex-col justify-center px-5 border-b ${themeObj.border} cursor-pointer ${themeObj.surfaceHover} transition-colors shrink-0`}
          onClick={() => router.push('/')}
        >
          <div className="flex items-center space-x-2">
            <AshokaChakra size={18} className="text-[#FF6B00]" />
            <h1 className="text-lg font-black tracking-tight uppercase leading-none">
              BHARAT<span className="text-[#FF6B00]">FIRST</span>
            </h1>
          </div>
          <span className={`text-[9px] font-mono uppercase tracking-[0.2em] ${themeObj.subtle} mt-0.5 flex items-center`}>
            <Shield size={9} className="mr-1 text-[#FF6B00]" /> Admin Panel
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto hide-scrollbar relative" aria-label="Admin navigation">
          <div className="absolute bottom-10 left-10 opacity-[0.02] pointer-events-none -z-10">
            <IndiaMapWatermark className="w-48 h-48 text-[#FFFFFF]" />
          </div>

          {adminModules.map((moduleGroup, idx) => (
            <div key={idx} className="mb-4">
              <h3 className={`px-5 py-1.5 text-[9px] uppercase tracking-[0.25em] ${themeObj.subtle} font-bold`}>
                {moduleGroup.group}
              </h3>
              <ul className="space-y-0.5 relative z-10">
                {moduleGroup.items.map(item => {
                  const active = item.route !== '/admin'
                    ? pathname.startsWith(item.route)
                    : pathname === item.route;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => router.push(item.route)}
                        aria-current={active ? 'page' : undefined}
                        className={`w-full flex items-center px-5 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                          active
                            ? `${themeObj.surface2} text-[#FF6B00] border-r-2 border-[#FF6B00]`
                            : `${themeObj.muted} hover:${themeObj.text} hover:${themeObj.surfaceHover}`
                        }`}
                      >
                        <item.icon size={14} className={`mr-3 shrink-0 ${active ? 'text-[#FF6B00]' : ''}`} />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className={`p-4 border-t ${themeObj.border} shrink-0`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 flex items-center justify-center font-black text-xs border border-[#FF6B00] text-[#FF6B00] rounded-sm shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className={`text-xs font-semibold truncate ${themeObj.text}`}>
                {session?.user?.name || session?.user?.email || 'Admin'}
              </div>
              <div className={`text-[9px] font-mono uppercase tracking-[0.1em] text-[#FF6B00] flex items-center`}>
                <CheckCircle2 size={9} className="mr-1" />
                {session?.user?.role || 'ADMIN'}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            themeObj={themeObj}
            onClick={handleSignOut}
            className="w-full py-1.5 text-[10px]"
          >
            <LogOut size={11} className="mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ml-64 flex flex-col min-h-screen ${themeObj.bg}`}>
        {/* Top Bar */}
        <header className={`h-14 ${themeObj.surface} border-b ${themeObj.border} flex items-center justify-between px-6 sticky top-0 z-10`}>
          <h2 className={`text-sm font-bold uppercase tracking-widest ${themeObj.text}`}>{pageTitle}</h2>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" themeObj={themeObj} className="!font-mono !text-[9px] flex items-center">
              <Database size={9} className="mr-1" /> Live
            </Badge>
            <button
              onClick={() => router.push('/')}
              className={`text-[10px] font-semibold uppercase tracking-wide ${themeObj.muted} hover:text-[#FF6B00] transition-colors`}
            >
              View Site →
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-auto">
          <Reveal type="fade">
            {children}
          </Reveal>
        </div>
      </main>
    </div>
  );
}
