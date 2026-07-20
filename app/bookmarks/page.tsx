"use client";

import React from 'react';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useAppContext } from '@/providers/AppProvider';

export default function BookmarksPage() {
  const { themeObj, bookmarks, toggleBookmark } = useAppContext();
  const router = useRouter();
  const [bookmarkedArticles, setBookmarkedArticles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (bookmarks.length === 0) {
      setLoading(false);
      return;
    }
    // Fetch article details for each bookmark
    const fetchBookmarks = async () => {
      try {
        const promises = bookmarks.map(id =>
          fetch(`/api/articles/${id}`).then(r => r.ok ? r.json() : null).catch(() => null)
        );
        const results = await Promise.all(promises);
        setBookmarkedArticles(results.filter(Boolean));
      } catch {
        setBookmarkedArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [bookmarks]);

  return (
    <div className={`min-h-screen ${themeObj.bg} ${themeObj.text}`}>
      <PublicHeader />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-black uppercase tracking-widest flex items-center">
              <Bookmark size={28} className="mr-3 text-[#FF6B00]" />
              Saved Articles
            </h1>
            {bookmarks.length > 0 && (
              <span className={`text-sm ${themeObj.muted}`}>{bookmarks.length} saved</span>
            )}
          </div>

          {loading ? (
            <div className={`text-center py-20 ${themeObj.muted}`}>
              <div className="animate-shimmer w-full h-24 rounded-sm mb-4" />
              <div className="animate-shimmer w-full h-24 rounded-sm" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className={`text-center py-20 border ${themeObj.border} border-dashed rounded-sm`}>
              <Bookmark size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium mb-2">No bookmarks yet</p>
              <p className={`text-sm ${themeObj.muted} mb-6`}>Save articles to read them later</p>
              <button
                onClick={() => router.push('/')}
                className="text-[#FF6B00] text-sm font-semibold hover:underline"
              >
                Browse Articles
              </button>
            </div>
          ) : (
            <div className={`divide-y ${themeObj.border}`}>
              {bookmarkedArticles.map(article => (
                <article
                  key={article.id}
                  className={`py-5 group flex items-start justify-between gap-4`}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => router.push(`/article/${article.id}`)}
                  >
                    {article.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FF6B00] mb-1 block">
                        {article.category.name}
                      </span>
                    )}
                    <h2 className={`text-base font-bold ${themeObj.text} group-hover:text-[#FF6B00] transition-colors line-clamp-2 mb-1`}>
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className={`text-sm ${themeObj.muted} line-clamp-2`}>{article.excerpt}</p>
                    )}
                    <p className={`text-xs ${themeObj.subtle} mt-2`}>
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className={`w-20 h-14 object-cover rounded-sm border ${themeObj.border} cursor-pointer`}
                        onClick={() => router.push(`/article/${article.id}`)}
                      />
                    )}
                    <button
                      onClick={() => toggleBookmark(article.id)}
                      className={`p-2 rounded-sm border ${themeObj.border} hover:border-red-500 hover:text-red-500 transition-colors`}
                      aria-label="Remove bookmark"
                      title="Remove bookmark"
                    >
                      <Bookmark size={14} className="fill-current text-[#FF6B00]" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
