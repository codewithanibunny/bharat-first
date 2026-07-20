import React from 'react';
import prisma from '@/lib/prisma';
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Mail, 
  Video, 
  Plus, 
  Layout, 
  Settings, 
  Activity,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [
    totalArticles,
    totalViews,
    totalUsers,
    totalComments,
    totalSubscribers,
    totalShorts,
    recentArticles,
    recentUsers
  ] = await Promise.all([
    prisma.article.count(),
    prisma.view.count(),
    prisma.user.count(),
    prisma.comment.count(),
    prisma.subscriber.count(),
    prisma.shortNews.count(),
    prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { author: true }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const statCards = [
    { label: 'Total Articles', value: totalArticles, icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Total Views', value: totalViews, icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Comments', value: totalComments, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Subscribers', value: totalSubscribers, icon: Mail, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { label: 'Shorts', value: totalShorts, icon: Video, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-neutral-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#FF6B00]">
            Command Center
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Real-time system metrics and administrative controls.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/articles/new" className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e66000] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
            <Plus size={16} />
            Create Article
          </Link>
          <button className="p-2 border border-neutral-700 hover:border-neutral-500 rounded-md transition-colors text-neutral-400 hover:text-white">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#111] border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-[#111] border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-[#151515]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-[#FF6B00]" />
              Recent Articles
            </h2>
            <Link href="/admin/articles" className="text-xs text-neutral-400 hover:text-[#FF6B00] flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-neutral-800 flex-1">
            {recentArticles.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-sm">No articles found.</div>
            ) : (
              recentArticles.map(article => (
                <div key={article.id} className="p-5 hover:bg-[#151515] transition-colors group">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-neutral-200 group-hover:text-white transition-colors">{article.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${article.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                          {article.status}
                        </span>
                        <span>•</span>
                        <span>{article.author?.name || 'Unknown Author'}</span>
                        <span>•</span>
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Users */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-800 bg-[#151515]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-[#FF6B00]" />
                New Users
              </h2>
            </div>
            <div className="divide-y divide-neutral-800">
              {recentUsers.length === 0 ? (
                <div className="p-6 text-center text-neutral-500 text-sm">No users found.</div>
              ) : (
                recentUsers.map(user => (
                  <div key={user.id} className="p-4 flex items-center gap-3 hover:bg-[#151515] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-neutral-200 truncate">{user.name || 'Anonymous'}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email || 'No email'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-800 bg-[#151515]">
              <h2 className="text-lg font-bold text-white">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <Link href="/admin/pages" className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#151515] hover:bg-[#1a1a1a] border border-neutral-800 hover:border-[#FF6B00]/50 transition-all group">
                <Layout size={24} className="text-neutral-400 group-hover:text-[#FF6B00] mb-2 transition-colors" />
                <span className="text-xs font-medium text-neutral-300">Pages</span>
              </Link>
              <Link href="/admin/shorts" className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#151515] hover:bg-[#1a1a1a] border border-neutral-800 hover:border-[#FF6B00]/50 transition-all group">
                <Video size={24} className="text-neutral-400 group-hover:text-[#FF6B00] mb-2 transition-colors" />
                <span className="text-xs font-medium text-neutral-300">Shorts</span>
              </Link>
              <Link href="/admin/subscribers" className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#151515] hover:bg-[#1a1a1a] border border-neutral-800 hover:border-[#FF6B00]/50 transition-all group">
                <Mail size={24} className="text-neutral-400 group-hover:text-[#FF6B00] mb-2 transition-colors" />
                <span className="text-xs font-medium text-neutral-300">Mail</span>
              </Link>
              <Link href="/admin/settings" className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#151515] hover:bg-[#1a1a1a] border border-neutral-800 hover:border-[#FF6B00]/50 transition-all group">
                <Settings size={24} className="text-neutral-400 group-hover:text-[#FF6B00] mb-2 transition-colors" />
                <span className="text-xs font-medium text-neutral-300">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
