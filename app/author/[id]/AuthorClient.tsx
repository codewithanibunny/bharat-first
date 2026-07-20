"use client";

import React, { useState } from 'react';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Loader2 } from 'lucide-react';
import { useAppContext } from '@/providers/AppProvider';

export default function AuthorClient({ author, initialArticles, totalCount }: { author: any, initialArticles: any[], totalCount: number }) {
  const { themeObj } = useAppContext();
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length < totalCount);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/articles?author=${encodeURIComponent(author.id)}&page=${nextPage}&limit=12`);
      const data = await res.json();
      
      if (data.articles && data.articles.length > 0) {
        setArticles(prev => [...prev, ...data.articles]);
        setPage(nextPage);
        setHasMore(articles.length + data.articles.length < totalCount);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {articles.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold uppercase tracking-widest font-[var(--font-playfair)]">
              Latest from {author.name}
            </h2>
            <span className={`text-sm font-bold uppercase tracking-wider ${themeObj.muted}`}>
              {totalCount} Reports
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} category={article.category} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-12 mb-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-sm transition-all hover:shadow-[0_0_20px_rgba(255,107,0,0.2)] border border-[#FF6B00] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-0 bg-[#FF6B00] transition-all duration-300 ease-out group-hover:w-full"></div>
                <span className={`relative flex items-center justify-center font-bold uppercase tracking-widest text-sm ${loading ? 'text-[#FF6B00]' : 'text-[#FF6B00] group-hover:text-white'}`}>
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More Reports'
                  )}
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-24 text-center border border-[var(--border)] border-dashed rounded-sm bg-[var(--surface)]">
          <div className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">No reports published by this author yet.</div>
        </div>
      )}
    </>
  );
}
