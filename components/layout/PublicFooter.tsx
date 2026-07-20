"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AshokaChakra } from '@/components/ui/Icons';
import { useAppContext } from '@/providers/AppProvider';
import { Hash, MessageCircle, Camera, Video, Briefcase, Send, ExternalLink } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  target: string;
  order: number;
  children?: MenuItem[];
}

interface FooterSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
  copyright_text: string;
  twitter_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  telegram_url: string;
  linkedin_url: string;
  contact_email: string;
}

export const PublicFooter = () => {
  const { themeObj } = useAppContext();
  const router = useRouter();
  const [settings, setSettings] = useState<FooterSettings>({
    site_name: 'Bharat First',
    site_tagline: 'Truth · Research · Bharat First',
    site_description: 'Independent Open Source Intelligence, defence analysis, and geopolitical research platform.',
    copyright_text: '',
    twitter_url: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    telegram_url: '',
    linkedin_url: '',
    contact_email: 'bharatfirst111@gmail.com',
  });
  const [exploreLinks, setExploreLinks] = useState<MenuItem[]>([]);
  const [companyLinks, setCompanyLinks] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Fetch settings
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings({
          site_name: data.site_name || 'Bharat First',
          site_tagline: data.site_tagline || 'Truth · Research · Bharat First',
          site_description: data.site_description || 'Independent Open Source Intelligence, defence analysis, and geopolitical research platform.',
          copyright_text: data.copyright_text || '',
          twitter_url: data.twitter_url || '',
          facebook_url: data.facebook_url || '',
          instagram_url: data.instagram_url || '',
          youtube_url: data.youtube_url || '',
          telegram_url: data.telegram_url || '',
          linkedin_url: data.linkedin_url || '',
          contact_email: data.contact_email || 'bharatfirst111@gmail.com',
        });
      })
      .catch(() => {});

    // Fetch footer menus
    fetch('/api/menus')
      .then(r => r.json())
      .then((menus: any[]) => {
        const footerExplore = menus.find(m => m.location === 'FOOTER_EXPLORE');
        const footerCompany = menus.find(m => m.location === 'FOOTER_COMPANY');

        if (footerExplore?.items?.length) {
          setExploreLinks(footerExplore.items);
        } else {
          // Fallback defaults
          setExploreLinks([
            { id: '1', title: 'Home', url: '/', target: '_self', order: 0 },
            { id: '2', title: 'OSINT', url: '/osint', target: '_self', order: 1 },
            { id: '3', title: 'Defence', url: '/category/defence', target: '_self', order: 2 },
            { id: '4', title: 'Cybersecurity', url: '/category/cyber', target: '_self', order: 3 },
            { id: '5', title: 'Intelligence Shorts', url: '/shorts', target: '_self', order: 4 },
            { id: '6', title: 'Search', url: '/search', target: '_self', order: 5 },
          ]);
        }

        if (footerCompany?.items?.length) {
          setCompanyLinks(footerCompany.items);
        } else {
          setCompanyLinks([
            { id: '1', title: 'About', url: '/about', target: '_self', order: 0 },
            { id: '2', title: 'Contact', url: '/contact', target: '_self', order: 1 },
            { id: '3', title: 'Privacy Policy', url: '/privacy', target: '_self', order: 2 },
            { id: '4', title: 'Terms of Service', url: '/terms', target: '_self', order: 3 },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const socialLinks = [
    { url: settings.twitter_url, icon: <Hash size={16} />, label: 'Twitter / X' },
    { url: settings.facebook_url, icon: <MessageCircle size={16} />, label: 'Facebook' },
    { url: settings.instagram_url, icon: <Camera size={16} />, label: 'Instagram' },
    { url: settings.youtube_url, icon: <Video size={16} />, label: 'YouTube' },
    { url: settings.telegram_url, icon: <Send size={16} />, label: 'Telegram' },
    { url: settings.linkedin_url, icon: <Briefcase size={16} />, label: 'LinkedIn' },
  ].filter(s => s.url);

  const copyright = settings.copyright_text ||
    `© ${new Date().getFullYear()} ${settings.site_name}. All rights reserved.`;

  const handleNav = (item: MenuItem) => {
    if (item.target === '_blank') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.url);
    }
  };

  return (
    <footer className={`${themeObj.surface} border-t ${themeObj.border} mt-20 relative overflow-hidden`}>
      <div className="absolute inset-x-0 top-0 h-[2px] bg-[#FF6B00]" />

      {/* Background Watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-5 translate-x-1/4 translate-y-1/4">
        <AshokaChakra size={400} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Column 1: Brand */}
          <div className="md:col-span-2 space-y-5">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3"
              aria-label="Go to homepage"
            >
              <AshokaChakra size={24} className="text-[#FF6B00] shrink-0" />
              <div className="flex flex-col justify-center mt-1">
                <h2 className={`text-xl font-bold tracking-tight uppercase leading-none ${themeObj.text}`}>
                  {settings.site_name.split(' ')[0]}
                  <span className="text-[#FF6B00] tracking-tight ml-1">
                    {settings.site_name.split(' ').slice(1).join(' ') || 'FIRST'}
                  </span>
                </h2>
              </div>
            </button>
            <p className={`text-sm ${themeObj.muted} italic max-w-sm`}>
              {settings.site_description}
            </p>
            <div className={`text-[10px] uppercase tracking-[0.2em] font-medium ${themeObj.subtle}`}>
              {settings.site_tagline}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map(social => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`p-2 rounded-sm border ${themeObj.border} ${themeObj.muted} hover:text-[#FF6B00] hover:border-[#FF6B00] transition-colors`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wide ${themeObj.text} mb-5`}>Explore</h3>
            <ul className="space-y-2.5">
              {exploreLinks.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item)}
                    className={`text-sm ${themeObj.muted} hover:text-[#FF6B00] transition-colors flex items-center gap-1`}
                  >
                    {item.title}
                    {item.target === '_blank' && <ExternalLink size={10} className="opacity-50" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wide ${themeObj.text} mb-5`}>Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item)}
                    className={`text-sm ${themeObj.muted} hover:text-[#FF6B00] transition-colors flex items-center gap-1`}
                  >
                    {item.title}
                    {item.target === '_blank' && <ExternalLink size={10} className="opacity-50" />}
                  </button>
                </li>
              ))}
            </ul>

            {settings.contact_email && (
              <div className="mt-6">
                <h3 className={`text-xs font-semibold uppercase tracking-wide ${themeObj.text} mb-2`}>Contact</h3>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className={`text-sm ${themeObj.muted} hover:text-[#FF6B00] transition-colors`}
                >
                  {settings.contact_email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${themeObj.border} py-5`}>
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <p className={themeObj.subtle}>{copyright}</p>
          <p className={`${themeObj.subtle} uppercase tracking-widest text-[9px] font-medium`}>
            An Independent Intelligence Platform
          </p>
        </div>
      </div>
    </footer>
  );
};
