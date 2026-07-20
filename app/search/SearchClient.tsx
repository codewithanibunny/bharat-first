"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, Loader2, FileText, Zap, ArrowRight, Filter } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useAppContext } from '@/providers/AppProvider';

function SearchResults({ categories }: { categories: any[] }) {
  const { themeObj, theme } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState('');
  const [results, setResults] = useState<{ articles: any[]; shorts: any[]; query: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, categoryId);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (inputValue.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        performSearch(inputValue, categoryId);
      }, 500);
    } else if (inputValue.trim().length === 0) {
      setResults(null);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputValue, categoryId]);

  const performSearch = async (q: string, catId: string) => {
    if (!q.trim() || q.trim().length < 2) return;
    setLoading(true);
    setQuery(q);
    try {
      let url = `/api/search?q=${encodeURIComponent(q.trim())}`;
      if (catId) url += `&category=${encodeURIComponent(catId)}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults({ articles: [], shorts: [], query: q });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      performSearch(inputValue.trim(), categoryId);
    }
  };

  const totalResults = (results?.articles.length || 0) + (results?.shorts.length || 0);
  
  // Premium Saffron / Monochrome dynamic styles
  const inputThemeClasses = theme === 'dark' 
    ? 'bg-[#1A1A1A] border-[#333] text-white focus:border-[#FF6B00]' 
    : 'bg-white border-gray-200 text-black focus:border-[#FF6B00] shadow-sm';
    
  const filterThemeClasses = theme === 'dark'
    ? 'bg-[#121212] border-[#333] text-gray-300'
    : 'bg-gray-50 border-gray-200 text-gray-700';

  return (
    <div className={`min-h-screen ${themeObj.bg} ${themeObj.text}`}>
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-widest mb-8 flex items-center">
              <Search size={32} className="mr-4 text-[#FF6B00]" />
              Intelligence Search
            </h1>
            
            <form onSubmit={handleSubmit} className="relative mb-6">
              <input
                type="search"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Search intelligence reports, articles, topics..."
                autoFocus
                className={`w-full text-xl font-medium border-2 rounded-sm px-6 py-4 outline-none transition-all pr-14 ${inputThemeClasses}`}
                aria-label="Search query"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => { setInputValue(''); setResults(null); }}
                  className={`absolute right-14 top-1/2 -translate-y-1/2 p-1 ${themeObj.muted} hover:text-[#FF6B00]`}
                >
                  <X size={20} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#FF6B00] hover:text-[#E65100] transition-colors"
                aria-label="Submit search"
              >
                <ArrowRight size={24} />
              </button>
            </form>

            <div className={`flex flex-wrap items-center gap-3 p-4 rounded-sm border ${filterThemeClasses}`}>
              <Filter size={16} className="text-[#FF6B00]" />
              <span className="text-sm font-semibold uppercase tracking-wider">Filter by Category:</span>
              <div className="flex flex-wrap gap-2 ml-2">
                <button 
                  onClick={() => setCategoryId('')}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${categoryId === '' ? 'bg-[#FF6B00] text-white' : 'bg-transparent border border-current opacity-70 hover:opacity-100'}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${categoryId === cat.id ? 'bg-[#FF6B00] text-white' : 'bg-transparent border border-current opacity-70 hover:opacity-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-[#FF6B00]" />
            </div>
          )}

          {!loading && !results && inputValue.length < 2 && (
            <div className={`text-center py-24 ${themeObj.muted} border border-dashed ${themeObj.border} rounded-sm`}>
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl font-medium">Type a query to search our intelligence archive</p>
              <p className="text-sm mt-2">Enter at least 2 characters to begin searching</p>
            </div>
          )}

          {!loading && results && (
            <div>
              <div className={`flex items-center justify-between border-b ${themeObj.border} pb-4 mb-8`}>
                <p className={`text-sm uppercase tracking-widest font-semibold ${themeObj.muted}`}>
                  Found <span className="text-[#FF6B00] font-black">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for &ldquo;{results.query}&rdquo;
                </p>
              </div>

              {results.articles.length > 0 && (
                <section className="mb-14">
                  <h2 className={`text-sm font-bold uppercase tracking-widest ${themeObj.subtle} mb-6 flex items-center`}>
                    <FileText size={16} className="mr-3 text-[#FF6B00]" />
                    Comprehensive Reports ({results.articles.length})
                  </h2>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
                    {results.articles.map((article: any) => (
                      <article
                        key={article.id}
                        onClick={() => router.push(`/article/${article.id}`)}
                        className={`p-6 cursor-pointer group ${themeObj.surfaceHover} border ${themeObj.border} transition-all duration-300 rounded-sm hover:border-[#FF6B00] hover:shadow-[0_0_15px_rgba(255,107,0,0.1)]`}
                      >
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            {article.category && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00] mb-3 block">
                                {article.category.name}
                              </span>
                            )}
                            <h3 className={`text-xl font-bold ${themeObj.text} group-hover:text-[#FF6B00] transition-colors line-clamp-2 mb-3 leading-snug font-[var(--font-playfair)]`}>
                              {article.title}
                            </h3>
                            {article.excerpt && (
                              <p className={`text-sm ${themeObj.muted} line-clamp-3 mb-4 leading-relaxed`}>{article.excerpt}</p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(150,150,150,0.1)]">
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${themeObj.subtle}`}>
                              {article.author?.name || 'Editorial Desk'}
                            </p>
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${themeObj.subtle}`}>
                              {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {results.shorts.length > 0 && (
                <section>
                  <h2 className={`text-sm font-bold uppercase tracking-widest ${themeObj.subtle} mb-6 flex items-center`}>
                    <Zap size={16} className="mr-3 text-[#FF6B00]" />
                    Intelligence Shorts ({results.shorts.length})
                  </h2>
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                    {results.shorts.map((short: any) => (
                      <div
                        key={short.id}
                        onClick={() => router.push(`/short/${short.id}`)}
                        className={`p-4 cursor-pointer ${themeObj.surfaceHover} border ${themeObj.border} transition-all duration-300 rounded-sm hover:border-[#FF6B00] flex flex-col gap-3`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest bg-[#FF6B00]/10 px-2 py-1 rounded-sm">
                            {short.type}
                          </span>
                        </div>
                        <p className={`text-sm font-bold ${themeObj.text} leading-relaxed`}>{short.title}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {totalResults === 0 && (
                <div className={`text-center py-20 ${themeObj.muted}`}>
                  <Search size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-xl font-bold mb-2">No results found</p>
                  <p className="text-sm">Try different keywords or browse our categories</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export default function SearchClient({ categories }: { categories: any[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center"><Loader2 className="animate-spin text-[#FF6B00]" size={40} /></div>}>
      <SearchResults categories={categories} />
    </Suspense>
  );
}
