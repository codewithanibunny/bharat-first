"use client";

import { useState, useEffect } from "react";
import { Tag, Loader2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

export default function TagsAdminPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setSaving(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      if (res.ok) {
        setName("");
        fetchTags();
      } else {
        throw new Error("Failed to create tag");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating tag");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTags();
      } else {
        throw new Error("Failed to delete tag");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting tag");
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b border-[#2E2E2E] pb-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center">
          <Tag size={28} className="mr-3 text-[#FF6B00]" /> Intelligence Tags
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6 h-fit">
          <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Create Tag</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tag Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                placeholder="Geopolitics"
              />
              {name && (
                <div className="mt-2 text-xs font-mono text-gray-500">
                  Slug: {name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white"
              themeObj={THEMES.dark}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} className="mr-2" /> Add Tag</>}
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
          <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Active Tags</h2>
          {loading ? (
            <div className="flex justify-center p-8 text-gray-500"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-[#2E2E2E]">
                    <th className="pb-3 px-4">Tag</th>
                    <th className="pb-3 px-4">Articles</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-[#202020] transition-colors group">
                      <td className="py-4 px-4">
                        <div className="font-bold text-white mb-1">{tag.name}</div>
                        <div className="text-xs text-gray-500 font-mono">/{tag.slug}</div>
                      </td>
                      <td className="py-4 px-4 text-sm font-mono text-gray-400">
                        {tag._count?.articles || 0}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDelete(tag.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-[#2E2E2E]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tags.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-gray-500 font-mono text-xs uppercase">
                        NO TAGS FOUND.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
