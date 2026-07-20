"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Bookmark, Share2, Type, MonitorPlay, ChevronRight, ThumbsUp, MessageSquare, Printer, ArrowUp, Eye, Send } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { AshokaChakra } from '@/components/ui/Icons';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useAppContext } from '@/providers/AppProvider';
import { useSession } from 'next-auth/react';

interface Author {
  id: string;
  name: string | null;
  image?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
  readTime: number;
  status: string;
  breaking: boolean;
  featured: boolean;
  isOSINT: boolean;
  authorId: string;
  author?: Author | null;
  categoryId: string;
  category?: Category | null;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; image?: string | null };
  replies?: Comment[];
}

export function ArticleClient({ article, category, features = {}, relatedArticles = [] }: { article: Article; category: Category | null; features?: Record<string, string>; relatedArticles?: Article[] }) {
  const { themeObj, toggleBookmark, isBookmarked } = useAppContext();
  const { data: session } = useSession();
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('lg');
  const [readingMode, setReadingMode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = (totalScroll / windowHeight) * 100;
      setScrollProgress(scroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bookmarked = isBookmarked(article.id);
  const fontSizeClass = fontSize === 'base' ? 'text-base' : fontSize === 'lg' ? 'text-lg' : 'text-xl';

  // Track view + fetch engagement data
  useEffect(() => {
    // Record view
    fetch(`/api/articles/${article.id}/view`, { method: 'POST' }).catch(() => {});

    // Fetch like status
    fetch(`/api/articles/${article.id}/like`)
      .then(r => r.json())
      .then(data => {
        setLiked(data.liked);
        setLikeCount(data.count || 0);
      })
      .catch(() => {});

    // Fetch comments
    fetchComments();
  }, [article.id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/articles/${article.id}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleLike = async () => {
    if (!session) {
      alert('Please log in to like articles');
      return;
    }
    try {
      const res = await fetch(`/api/articles/${article.id}/like`, { method: 'POST' });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(prev => data.liked ? prev + 1 : Math.max(0, prev - 1));
    } catch {}
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.excerpt || article.title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { alert('Please log in to comment'); return; }
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/articles/${article.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        setCommentText('');
        await fetchComments();
      }
    } catch {} finally {
      setSubmittingComment(false);
    }
  };

  const displayDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date(article.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const authorName = article.author?.name || 'Bharat First Editorial';

  if (!article) {
    return (
      <div className={`min-h-screen ${themeObj.bg} flex items-center justify-center`}>
        <p className={`text-xl ${themeObj.muted}`}>Article not found.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeObj.bg} transition-colors duration-400`}>
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[#FF6B00] z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      <PublicHeader />

      <article className="pt-28 pb-20">
        {/* ── Hero Image ── */}
        {!readingMode && article.imageUrl && (
          <Reveal type="fade">
            <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-t ${themeObj.name === 'dark' ? 'from-[#0F0F0F] via-[#0F0F0F]/50' : 'from-[#FAFAF8] via-[#FAFAF8]/40'} to-transparent z-10`} />
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full z-20 pb-12">
                <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                  <Reveal delay={150} className="flex items-center space-x-2 mb-4">
                    {category && <Badge variant="bhagwa" themeObj={themeObj}>{category.name}</Badge>}
                    {article.isOSINT && <Badge variant="outline" themeObj={themeObj}>OSINT Verified</Badge>}
                    {article.breaking && <Badge variant="bhagwa" themeObj={themeObj}>Breaking</Badge>}
                  </Reveal>
                  <Reveal delay={250}>
                    <h1 className="text-display mb-4" style={{ textShadow: themeObj.name === 'dark' ? '0 2px 20px rgba(0,0,0,0.6)' : 'none' }}>
                      {article.title}
                    </h1>
                  </Reveal>
                  <Reveal delay={350}>
                    <p className={`text-xl ${themeObj.muted} leading-relaxed max-w-3xl`}>
                      {article.excerpt}
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── No-image header ── */}
        {!readingMode && !article.imageUrl && (
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl mb-12">
            <div className="flex items-center space-x-2 mb-4">
              {category && <Badge variant="bhagwa" themeObj={themeObj}>{category.name}</Badge>}
              {article.isOSINT && <Badge variant="outline" themeObj={themeObj}>OSINT Verified</Badge>}
              {article.breaking && <Badge variant="bhagwa" themeObj={themeObj}>Breaking</Badge>}
            </div>
            <h1 className="text-display mb-4">{article.title}</h1>
            {article.excerpt && (
              <p className={`text-xl ${themeObj.muted} leading-relaxed max-w-3xl`}>
                {article.excerpt}
              </p>
            )}
          </div>
        )}

        {/* ── Reading Mode Header ── */}
        {readingMode && (
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl mb-8">
            <h1 className="text-display mb-4">{article.title}</h1>
          </div>
        )}

        {/* ── Content Area ── */}
        <div className={`container mx-auto px-4 lg:px-8 max-w-6xl ${!readingMode ? 'mt-12' : ''}`}>
          <div className="flex flex-col lg:flex-row gap-12 relative">

            {/* Left Sidebar — Article Meta */}
            {!readingMode && (
              <aside className="lg:w-56 hidden lg:block shrink-0" aria-label="Article metadata">
                <div className="sticky top-28 space-y-8">
                  <Reveal>
                    <div className="space-y-5">
                      <div>
                        <div className={`text-label ${themeObj.subtle} mb-1`}>Author</div>
                        <div className={`text-sm font-medium ${themeObj.text}`}>{authorName}</div>
                      </div>
                      <div>
                        <div className={`text-label ${themeObj.subtle} mb-1`}>Published</div>
                        <div className={`text-sm ${themeObj.muted}`}>{displayDate}</div>
                      </div>
                      <div>
                        <div className={`text-label ${themeObj.subtle} mb-1`}>Read Time</div>
                        <div className={`text-sm ${themeObj.muted} flex items-center`}>
                          <Clock size={12} className="mr-1.5 text-[#FF6B00]" />
                          {article.readTime} min read
                        </div>
                      </div>
                      <div>
                        <div className={`text-label ${themeObj.subtle} mb-1`}>Engagement</div>
                        <div className={`text-sm ${themeObj.muted} space-y-1`}>
                          <div className="flex items-center">
                            <ThumbsUp size={11} className="mr-1.5 text-[#FF6B00]" /> {likeCount} endorsements
                          </div>
                          {features.enable_comments !== 'false' && (
                          <div className="flex items-center">
                            <MessageSquare size={11} className="mr-1.5 text-[#FF6B00]" /> {comments.length} comments
                          </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  {category && (
                    <Reveal delay={100}>
                      <div className={`pt-6 border-t ${themeObj.border}`}>
                        <div className={`text-label ${themeObj.subtle} mb-3`}>Category</div>
                        <Badge variant="outline" themeObj={themeObj}>{category.name}</Badge>
                      </div>
                    </Reveal>
                  )}
                </div>
              </aside>
            )}

            {/* Main Content */}
            <div className={`flex-1 ${readingMode ? 'max-w-3xl mx-auto' : 'max-w-3xl'}`}>
              {/* Action Bar */}
              <div className={`flex items-center justify-between mb-8 pb-4 border-b ${themeObj.border}`}>
                <div className="flex items-center space-x-2">
                  {features.enable_bookmarks !== 'false' && (
                  <button
                    onClick={() => toggleBookmark(article.id)}
                    className={`p-2 rounded-sm border ${themeObj.border} ${themeObj.surfaceHover} transition-colors`}
                    title={bookmarked ? 'Remove bookmark' : 'Save article'}
                    aria-label={bookmarked ? 'Remove bookmark' : 'Save article'}
                  >
                    <Bookmark size={15} className={bookmarked ? 'text-[#FF6B00] fill-current' : themeObj.text} />
                  </button>
                  )}
                  <button
                    onClick={handleShare}
                    className={`p-2 rounded-sm border ${themeObj.border} ${themeObj.surfaceHover} transition-colors`}
                    title="Share article"
                    aria-label="Share article"
                  >
                    <Share2 size={15} className={themeObj.text} />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className={`p-2 rounded-sm border ${themeObj.border} ${themeObj.surfaceHover} transition-colors`}
                    title="Print article"
                    aria-label="Print article"
                  >
                    <Printer size={15} className={themeObj.text} />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setFontSize(prev => prev === 'base' ? 'lg' : prev === 'lg' ? 'xl' : 'base')}
                    className={`text-label ${themeObj.muted} hover:text-[#FF6B00] transition-colors flex items-center`}
                    aria-label="Change font size"
                  >
                    <Type size={13} className="mr-1" /> {fontSize === 'base' ? 'Sm' : fontSize === 'lg' ? 'Md' : 'Lg'}
                  </button>
                  <span className={`${themeObj.border} text-xs border-l h-4`} />
                  <button
                    onClick={() => setReadingMode(!readingMode)}
                    className={`text-label ${readingMode ? 'text-[#FF6B00]' : themeObj.muted} hover:text-[#FF6B00] transition-colors flex items-center`}
                    aria-label="Toggle reading mode"
                  >
                    <MonitorPlay size={13} className="mr-1" /> Focus
                  </button>
                </div>
              </div>

              {/* Article Body */}
              <div className={`prose-editorial ${fontSizeClass}`}>
                {article.content ? (
                  article.content.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                    <Reveal key={i} delay={Math.min(i * 20, 200)}>
                      <p className="mb-6">{paragraph}</p>
                    </Reveal>
                  ))
                ) : (
                  <p className={themeObj.muted}>Content not available.</p>
                )}
              </div>

              {/* Article Footer */}
              <Reveal>
                <div className={`mt-12 pt-8 border-t ${themeObj.border}`}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant={liked ? "primary" : "outline"}
                        themeObj={themeObj}
                        onClick={handleLike}
                        aria-label={liked ? 'Unlike article' : 'Like article'}
                      >
                        <ThumbsUp size={14} className="mr-2" />
                        {liked ? 'Endorsed' : 'Endorse'} {likeCount > 0 && `(${likeCount})`}
                      </Button>
                      {features.enable_comments !== 'false' && (
                      <Button
                        variant="outline"
                        themeObj={themeObj}
                        onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        <MessageSquare size={14} className="mr-2" />
                        Discuss ({comments.length})
                      </Button>
                      )}
                    </div>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className={`text-label ${themeObj.muted} hover:text-[#FF6B00] transition-colors flex items-center`}
                    >
                      <ArrowUp size={12} className="mr-1" /> Back to top
                    </button>
                  </div>
                </div>
              </Reveal>

              {/* Comments Section */}
              {features.enable_comments !== 'false' && (
              <section id="comments" className={`mt-16 pt-12 border-t ${themeObj.border}`}>
                <h2 className={`text-headline mb-8 flex items-center`}>
                  <MessageSquare size={20} className="mr-3 text-[#FF6B00]" />
                  Discussion ({comments.length})
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-10">
                  <div className={`border ${themeObj.border} rounded-sm overflow-hidden focus-within:border-[#FF6B00] transition-colors`}>
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder={session ? "Share your perspective..." : "Please log in to join the discussion"}
                      disabled={!session || submittingComment}
                      maxLength={2000}
                      rows={3}
                      className={`w-full ${themeObj.inputBg} p-4 ${themeObj.text} resize-none outline-none text-sm disabled:opacity-50`}
                      aria-label="Write a comment"
                    />
                    <div className={`flex items-center justify-between px-4 py-2 ${themeObj.surface2} border-t ${themeObj.border}`}>
                      <span className={`text-xs ${themeObj.subtle}`}>{commentText.length}/2000</span>
                      {session ? (
                        <button
                          type="submit"
                          disabled={!commentText.trim() || submittingComment}
                          className="flex items-center text-xs font-semibold text-[#FF6B00] hover:text-[#E65100] disabled:opacity-40 transition-colors"
                        >
                          <Send size={12} className="mr-1.5" />
                          {submittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      ) : (
                        <a href="/login" className="text-xs font-semibold text-[#FF6B00] hover:underline">
                          Log in to comment
                        </a>
                      )}
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                {comments.length === 0 ? (
                  <div className={`text-center py-12 ${themeObj.muted} text-sm`}>
                    <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
                    Be the first to share your perspective
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.map(comment => (
                      <div key={comment.id} className={`flex gap-4`}>
                        <div className="shrink-0">
                          {comment.user.image ? (
                            <img src={comment.user.image} alt={comment.user.name || 'User'} className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className={`w-8 h-8 rounded-full ${themeObj.surface2} border ${themeObj.border} flex items-center justify-center text-xs font-bold text-[#FF6B00]`}>
                              {(comment.user.name || 'A')[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold ${themeObj.text}`}>{comment.user.name || 'Anonymous'}</span>
                            <span className={`text-xs ${themeObj.subtle}`}>
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={`text-sm ${themeObj.text} leading-relaxed`}>{comment.content}</p>
                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className={`mt-4 pl-4 border-l-2 border-[#FF6B00]/20 space-y-4`}>
                              {comment.replies.map(reply => (
                                <div key={reply.id} className="flex gap-3">
                                  <div className={`w-6 h-6 rounded-full ${themeObj.surface2} border ${themeObj.border} flex items-center justify-center text-[10px] font-bold text-[#FF6B00] shrink-0`}>
                                    {(reply.user.name || 'A')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className={`text-xs font-semibold ${themeObj.text}`}>{reply.user.name || 'Anonymous'}</span>
                                    </div>
                                    <p className={`text-xs ${themeObj.muted}`}>{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              )}

              {/* Related Articles */}
              {relatedArticles && relatedArticles.length > 0 && (
                <section className={`mt-16 pt-12 border-t ${themeObj.border}`}>
                  <h2 className={`text-headline mb-8`}>Related Intelligence</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((rel, i) => (
                      <Reveal key={rel.id} delay={i * 100}>
                        <div 
                          className={`p-4 border ${themeObj.border} rounded-sm ${themeObj.surface} hover:border-[#FF6B00] transition-colors cursor-pointer h-full flex flex-col justify-between`} 
                          onClick={() => window.location.href = `/article/${rel.id}`}
                        >
                           <h3 className={`font-bold text-sm mb-4 ${themeObj.text} leading-snug`}>{rel.title}</h3>
                           <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                             {new Date(rel.createdAt).toLocaleDateString()}
                           </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar */}
            {!readingMode && (
              <aside className="lg:w-72 hidden lg:block shrink-0" aria-label="Related topics">
                <div className="sticky top-28 space-y-8">
                  <Reveal>
                    <div className={`p-6 ${themeObj.surface} border ${themeObj.border} rounded-sm`}>
                      <div className={`text-label ${themeObj.subtle} mb-3`}>Related Topics</div>
                      <div className="flex flex-wrap gap-2">
                        {(category ? [category.name, 'Defence', 'Strategy', 'Analysis'] : ['Defence', 'Strategy', 'Analysis', 'OSINT']).map(tag => (
                          <span
                            key={tag}
                            className={`text-[11px] px-2.5 py-1 border ${themeObj.border} ${themeObj.muted} hover:border-[#FF6B00] hover:text-[#FF6B00] cursor-pointer transition-colors rounded-sm`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={100}>
                    <div className={`p-6 ${themeObj.surface} border ${themeObj.border} rounded-sm`}>
                      <div className={`text-label ${themeObj.subtle} mb-3 flex items-center`}>
                        <Eye size={11} className="mr-1.5 text-[#FF6B00]" /> Stats
                      </div>
                      <div className={`space-y-2 text-sm ${themeObj.muted}`}>
                        <div className="flex justify-between">
                          <span>Endorsements</span>
                          <span className="font-medium">{likeCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Comments</span>
                          <span className="font-medium">{comments.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Read time</span>
                          <span className="font-medium">{article.readTime}m</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      <PublicFooter />
    </div>
  );
}
