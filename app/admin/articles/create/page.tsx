"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Save, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";

interface Category {
  id: string;
  name: string;
}

export default function CreateArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [breaking, setBreaking] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [isOSINT, setIsOSINT] = useState(false);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) setCategoryId(data[0].id);
    };
    fetchCategories();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, excerpt, content, categoryId, imageUrl, status, breaking, featured, isOSINT
        }),
      });
      if (res.ok) {
        router.push("/admin/articles");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b border-[#2E2E2E] pb-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center">
          <FileText size={28} className="mr-3 text-[#FF6B00]" /> Editorial Desk
        </h1>
        <button onClick={() => router.push("/admin/articles")} className="text-gray-500 hover:text-white flex items-center text-xs font-bold uppercase">
          <X size={16} className="mr-1" /> Discard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
            <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Core Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] text-xl font-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-gray-400 focus:outline-none focus:border-[#FF6B00] font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Excerpt (Meta Description)</label>
                <textarea
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] h-20 resize-none font-serif"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Article Body (Markdown Supported)</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] h-[500px] font-mono text-sm"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
            <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Publishing Metadata</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Category</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="pt-4 border-t border-[#2E2E2E] space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} className="form-checkbox text-[#FF6B00] bg-[#0D0D0D] border-[#2E2E2E] rounded focus:ring-[#FF6B00]" />
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white uppercase">Breaking News</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="form-checkbox text-[#FF6B00] bg-[#0D0D0D] border-[#2E2E2E] rounded focus:ring-[#FF6B00]" />
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white uppercase">Featured Hero Article</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={isOSINT} onChange={(e) => setIsOSINT(e.target.checked)} className="form-checkbox text-[#FF6B00] bg-[#0D0D0D] border-[#2E2E2E] rounded focus:ring-[#FF6B00]" />
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white uppercase">OSINT Verified</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
            <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Media</h2>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Hero Image URL</label>
              <div className="flex">
                <div className="bg-[#0D0D0D] border border-r-0 border-[#2E2E2E] rounded-l px-3 py-2 flex items-center justify-center">
                  <ImageIcon size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 bg-[#0D0D0D] border border-[#2E2E2E] rounded-r px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-4 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-lg rounded shadow-lg shadow-[#FF6B00]/20"
            themeObj={THEMES.dark}
          >
            {saving ? <Loader2 size={24} className="animate-spin" /> : <><Save size={24} className="mr-2" /> Publish Intelligence</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
