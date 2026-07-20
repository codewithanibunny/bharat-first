"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Edit3, Trash2, FileText, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";
import { Badge } from "@/components/ui/Badge";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  author: { name: string | null };
  category: { name: string } | null;
}

export default function ArticlesAdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      fetchArticles();
    } catch (error) {
      console.error(error);
      alert("Error deleting article");
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b border-[#2E2E2E] pb-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center">
          <FileText size={28} className="mr-3 text-[#FF6B00]" /> Editorial Desk
        </h1>
        <Button 
          onClick={() => router.push("/admin/articles/create")}
          themeObj={THEMES.dark}
          className="bg-[#FF6B00] hover:bg-[#e05e00] text-white !py-2"
        >
          <Plus size={16} className="mr-2" /> Draft Intelligence
        </Button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
        {loading ? (
          <div className="flex justify-center p-12 text-gray-500"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-[#2E2E2E]">
                  <th className="pb-3 px-4">Headline</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E2E2E]">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#202020] transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white mb-1 line-clamp-1">{article.title}</div>
                      <div className="text-xs text-gray-500 font-mono">/{article.slug}</div>
                    </td>
                    <td className="py-4 px-4">
                      {article.category ? (
                        <Badge variant="outline" themeObj={THEMES.dark}>{article.category.name}</Badge>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-xs font-bold uppercase tracking-wider">
                        {article.status === 'PUBLISHED' && <span className="text-green-500 flex items-center"><CheckCircle size={12} className="mr-1"/> Published</span>}
                        {article.status === 'DRAFT' && <span className="text-yellow-500 flex items-center"><Clock size={12} className="mr-1"/> Draft</span>}
                        {article.status === 'ARCHIVED' && <span className="text-gray-500">Archived</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-400 font-mono">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-[#FF6B00] transition-colors rounded hover:bg-[#2E2E2E]"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-[#2E2E2E]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-mono text-xs uppercase">
                      NO ARTICLES FOUND. BEGIN DRAFTING.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
