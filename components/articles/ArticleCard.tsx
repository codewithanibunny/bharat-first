"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Article, Category } from '@/types';
import { useAppContext } from '@/providers/AppProvider';

interface ArticleCardProps {
  article: Article;
  category?: Category;
  variant?: 'default' | 'hero';
}

export const ArticleCard = ({ article, category, variant = 'default' }: ArticleCardProps) => {
  const { themeObj, bookmarks, toggleBookmark } = useAppContext();
  const router = useRouter();
  const isHero = variant === 'hero';
  const isBookmarked = bookmarks.includes(article.id);

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (isHero) {
    return (
      <article className={`group flex flex-col md:flex-row ${themeObj.surface} rounded-sm overflow-hidden bhagwa-top-border`}>
        <div
          className="relative md:w-3/5 h-64 md:h-[500px] overflow-hidden cursor-pointer"
          onClick={() => router.push(`/article/${article.id}`)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={article.imageUrl || 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=2070'}
            alt={article.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            {category && <Badge variant="bhagwa" themeObj={themeObj}>{category.name || category.slug}</Badge>}
            {article.isOSINT && <Badge variant="outline" themeObj={themeObj} className="bg-black/50 backdrop-blur-sm">OSINT</Badge>}
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 md:w-2/5">
          <div className="flex items-center justify-between mb-5">
            <div className={`flex items-center gap-3 text-[11px] ${themeObj.muted} tracking-wide`}>
              <span suppressHydrationWarning>{formattedDate}</span>
              <span className={themeObj.subtle}>·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {article.readTime} min
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
              className={`${isBookmarked ? 'text-[#FF6B00]' : themeObj.subtle} hover:text-[#FF6B00] transition-colors duration-300`}
            >
              <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
            </button>
          </div>

          <h3
            onClick={() => router.push(`/article/${article.id}`)}
            className={`cursor-pointer font-[var(--font-playfair)] text-3xl md:text-5xl font-bold ${themeObj.text} leading-[1.1] mb-5 group-hover:text-[#FF6B00] transition-colors duration-300`}
          >
            {article.title}
          </h3>

          <p className={`font-[var(--font-playfair)] text-lg ${themeObj.muted} leading-relaxed line-clamp-4 mb-6`}>
            {article.excerpt}
          </p>

          <div className={`pt-5 border-t ${themeObj.border}`}>
            <span className={`text-[11px] font-semibold tracking-wide ${themeObj.text}`}>
              {article.authorId || 'Staff'}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`group flex flex-col ${themeObj.surface} border ${themeObj.border} rounded-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#FF6B00]/30`}>
      <div
        className="relative h-52 overflow-hidden cursor-pointer"
        onClick={() => router.push(`/article/${article.id}`)}
      >
        <img
          src={article.imageUrl || 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=2070'}
          alt={article.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {category && <Badge variant="bhagwa" themeObj={themeObj}>{category.name || category.slug}</Badge>}
          {article.isOSINT && <Badge variant="outline" themeObj={themeObj} className="bg-black/50 backdrop-blur-sm">OSINT</Badge>}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 text-[11px] ${themeObj.muted} tracking-wide`}>
            <span suppressHydrationWarning>{formattedDate}</span>
            <span className={themeObj.subtle}>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {article.readTime} min
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
            className={`${isBookmarked ? 'text-[#FF6B00]' : themeObj.subtle} hover:text-[#FF6B00] transition-colors duration-300`}
          >
            <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
          </button>
        </div>

        <h3
          onClick={() => router.push(`/article/${article.id}`)}
          className={`cursor-pointer font-[var(--font-playfair)] text-xl font-bold ${themeObj.text} leading-tight mb-3 group-hover:text-[#FF6B00] transition-colors duration-300`}
        >
          {article.title}
        </h3>

        <p className={`text-sm ${themeObj.muted} leading-relaxed line-clamp-3`}>
          {article.excerpt}
        </p>

        <div className={`mt-auto pt-4 border-t ${themeObj.border}`}>
          <span className={`text-[11px] font-semibold tracking-wide ${themeObj.text}`}>
            {article.authorId || 'Staff'}
          </span>
        </div>
      </div>
    </article>
  );
};
