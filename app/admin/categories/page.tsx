"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      });
      if (res.ok) {
        setName("");
        setSlug("");
        setDescription("");
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create category");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      alert("Network error occurred");
    }
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-8 border-b border-[#2E2E2E] pb-4">
        Category Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="md:col-span-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6 h-fit">
          <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Add New Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }
                }}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors h-24 resize-none"
              ></textarea>
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white"
              themeObj={THEMES.dark}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} className="mr-2" /> Create</>}
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
          <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Existing Categories</h2>
          {loading ? (
            <div className="flex justify-center p-8 text-gray-500"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="divide-y divide-[#2E2E2E]">
              {categories.map((c) => (
                <div key={c.id} className="py-4 flex justify-between items-center group">
                  <div>
                    <div className="font-bold text-white text-lg">{c.name}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">/{c.slug}</div>
                    {c.description && <div className="text-sm text-gray-400 mt-2">{c.description}</div>}
                  </div>
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="py-8 text-center text-gray-500 font-mono text-xs">NO TAXONOMY RECORDS FOUND</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
