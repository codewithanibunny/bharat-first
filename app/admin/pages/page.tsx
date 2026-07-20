"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Page = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  author: { name: string | null } | null;
};

export default function PagesAdmin() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (res.ok) {
        setPages(data);
      } else {
        console.error("Failed to fetch pages:", data.error);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPages(pages.filter(p => p.id !== id));
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete page");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Pages</h1>
          <p className="text-zinc-400 mt-1">Manage custom static pages for your site</p>
        </div>
        <Link 
          href="/admin/pages/create" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Create Page
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-400">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">No pages found. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Title & Slug</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Author</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{page.title}</div>
                      <div className="text-zinc-500 text-xs mt-1 font-mono">/{page.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      {page.isPublished ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {page.author?.name || 'System'}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(page.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <a 
                          href={`/${page.slug}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-zinc-400 hover:text-white transition-colors"
                          title="View Page"
                        >
                          View
                        </a>
                        <Link 
                          href={`/admin/pages/${page.id}/edit`}
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => deletePage(page.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
