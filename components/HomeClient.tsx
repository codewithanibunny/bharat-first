"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Radio, Zap, ChevronRight, TrendingUp, Activity, Radar, Target, ArrowRight } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Reveal } from '@/components/ui/Reveal';
import { AshokaChakra } from '@/components/ui/Icons';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ShortsCard } from '@/components/shorts/ShortsCard';
import { Button } from '@/components/ui/Button';
import { useAppContext } from '@/providers/AppProvider';
import { Article, Short, Category, WireDataItem } from '@/types';

// ── Newsletter Section Component ──────────────────────────────────────────────
function NewsletterSection({ themeObj }: { themeObj: any }) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');
  const [message, setMessage] = React.useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else if (res.status === 409) {
        setStatus('exists');
        setMessage('You are already subscribed.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className={`py-16 ${themeObj.surface2} border-t ${themeObj.border} ${themeObj.text}`}>
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center space-y-6">
        <h2 className="text-3xl font-black" style={{ fontFamily: 'var(--font-serif, serif)' }}>Access Secured Intel Briefings</h2>
        <p className={`text-sm max-w-md mx-auto ${themeObj.muted}`}>
          Subscribe to receive curated intelligence briefings directly to your inbox. Weekly dispatches.
        </p>
        {status === 'success' || status === 'exists' ? (
          <div className={`py-3 px-6 rounded-sm inline-flex items-center text-sm font-medium ${status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-[#FF6B00]/10 text-[#FF6B00]'}`}>
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === 'loading'}
              className={`w-full ${themeObj.bg} border ${themeObj.border} rounded-sm px-4 py-2.5 text-sm outline-none focus:border-[#FF6B00] ${themeObj.text} disabled:opacity-60`}
              aria-label="Email address for newsletter"
            />
            <Button
              type="submit"
              variant="primary"
              themeObj={themeObj}
              className="w-full sm:w-auto py-2.5 px-6 shrink-0"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-xs">{message}</p>
        )}
      </div>
    </section>
  );
}


export function HomeClient({ 
  articles, 
  shorts, 
  categories, 
  sections,
  features 
}: { 
  articles: Article[], 
  shorts: Short[], 
  categories: Category[], 
  sections: any[],
  features: Record<string, string>
}) {
  const { themeObj } = useAppContext();
  const router = useRouter();
  const [wireData, setWireData] = React.useState<WireDataItem[]>([]);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/wire');
        if (res.ok) setWireData(await res.json());
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const publishedArticles = articles.filter(a => a.status === 'PUBLISHED');
  const breaking = publishedArticles.filter(a => a.breaking);
  const featured = publishedArticles.find(a => a.featured) || publishedArticles[0];
  const latestShorts = [...shorts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  const latest = [...publishedArticles].filter(a => a.id !== featured?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  // Helper to render section blocks by type
  const renderSection = (sec: any) => {
    if (!sec.isVisible) return null;

    switch (sec.type) {
      case 'HERO':
        return (
          <section key={sec.id} className="py-12">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
              {featured ? (
                <Reveal type="fade">
                  <ArticleCard article={featured} category={categories.find(c => c.id === featured.categoryId)} variant="hero" />
                </Reveal>
              ) : (
                <Reveal type="fade">
                  <div className={`w-full py-24 ${themeObj.surface} border ${themeObj.border} rounded-sm flex flex-col items-center justify-center text-center px-8`}>
                    <AshokaChakra size={48} className="text-[#FF6B00] mb-6 opacity-30" />
                    <h2 className="text-headline mb-2">Awaiting Intelligence</h2>
                    <p className={`text-sm ${themeObj.muted} max-w-md mb-6`}>
                      No reports have been published yet. Access the Command Center to draft and publish the first report.
                    </p>
                    <Button variant="primary" themeObj={themeObj} onClick={() => router.push('/admin')}>
                      Access Command Center
                    </Button>
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        );

      case 'SHORTS_GRID':
        if (features.enable_shorts === 'false') return null;
        return latestShorts.length > 0 ? (
          <section key={sec.id} className={`py-12 border-y ${themeObj.border}`}>
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-[#FF6B00] mr-3" />
                  <h2 className="text-headline flex items-center">
                    <Zap size={18} className="mr-2 text-[#FF6B00]" /> Intelligence Shorts
                  </h2>
                </div>
                <button onClick={() => router.push('/shorts')} className={`text-xs font-medium ${themeObj.muted} hover:text-[#FF6B00] transition-colors flex items-center`}>
                  All Briefs <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestShorts.map((short, i) => (
                  <Reveal key={short.id} delay={i * 80}>
                    <ShortsCard short={short} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'LATEST_REPORTS':
        return (
          <section key={sec.id} className="py-12">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column — Reports */}
                <div className="lg:col-span-8 space-y-12">
                  <div>
                    <div className="flex items-center mb-8">
                      <div className="w-1 h-6 bg-[#FF6B00] mr-3" />
                      <h2 className="text-headline flex items-center">
                        <TrendingUp size={18} className="mr-2 text-[#FF6B00]" /> Latest Reports
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {latest.length > 0 ? (
                        latest.slice(0, 4).map((article, i) => (
                          <Reveal key={article.id} delay={i * 80}>
                            <ArticleCard article={article} category={categories.find(c => c.id === article.categoryId)} />
                          </Reveal>
                        ))
                      ) : (
                        <div className={`col-span-full py-16 border ${themeObj.border} border-dashed rounded-sm text-center`}>
                          <p className={`${themeObj.muted} text-sm`}>No reports published yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column — Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Live Wire */}
                  {features.enable_live_wire !== 'false' && (
                  <Reveal>
                    <div className={`${themeObj.surface} border ${themeObj.border} rounded-sm overflow-hidden`}>
                      <div className={`${themeObj.surface2} px-5 py-3.5 flex items-center justify-between border-b ${themeObj.border}`}>
                        <h3 className={`text-label ${themeObj.text} flex items-center`}>
                          <Activity size={12} className="mr-2 text-[#FF6B00]" /> Live Wire
                        </h3>
                        <button onClick={() => router.push('/osint')} className="text-[10px] text-[#FF6B00] hover:underline font-medium tracking-wide uppercase">
                          View All
                        </button>
                      </div>
                      <div className="overflow-y-auto max-h-[420px] hide-scrollbar">
                        {wireData.length > 0 ? (
                          <ul className={`divide-y ${themeObj.border}`}>
                            {wireData.map((item, i) => (
                              <li key={i} className={`px-5 py-4 ${themeObj.surfaceHover} transition-colors cursor-pointer`}>
                                <div className="text-[10px] text-[#FF6B00] mb-1.5 font-medium tracking-wide">
                                  {item.time}
                                </div>
                                <p className={`text-sm ${themeObj.text} leading-snug`}>{item.text}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className={`p-8 text-center ${themeObj.muted} text-sm`}>
                            No signals detected.
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'NEWSLETTER':
        if (features.enable_newsletter === 'false') return null;
        return <NewsletterSection key={sec.id} themeObj={themeObj} />;

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${themeObj.bg} flex flex-col ${themeObj.text} transition-colors duration-400`}>
      <PublicHeader />

      <main className="flex-grow pt-28">
        {/* ── Breaking News Strip ── */}
        {breaking.length > 0 && (
          <div className={`${themeObj.surface} border-y ${themeObj.border} overflow-hidden flex items-center h-9 relative z-40`}>
            <div className="bg-[#FF6B00] text-white text-[10px] font-semibold uppercase tracking-wider px-4 h-full flex items-center whitespace-nowrap z-10">
              <Radio size={10} className="mr-1.5 animate-pulse" /> Breaking
            </div>
            <div className="w-full overflow-hidden relative px-4 flex items-center">
              <div className="whitespace-nowrap flex space-x-12 animate-marquee">
                {breaking.concat(breaking).map((a, i) => (
                  <span key={i} onClick={() => router.push(`/article/${a.id}`)} className={`text-xs font-medium cursor-pointer ${themeObj.text} hover:text-[#FF6B00] transition-colors flex items-center`}>
                    <span className="w-1 h-1 bg-[#FF6B00] rounded-full mr-2" />{a.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render sections dynamically */}
        {sections && sections.length > 0 ? (
          sections.map(sec => renderSection(sec))
        ) : (
          <div className="py-24 text-center text-gray-400">No layout configured.</div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
