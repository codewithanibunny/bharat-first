"use client";

import { useState, useEffect } from "react";
import { Megaphone, Loader2, Trash2, Plus, Power, Edit3, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";
import { Badge } from "@/components/ui/Badge";

interface Advertisement {
  id: string;
  name: string;
  placement: string;
  imageUrl: string;
  targetUrl: string;
  active: boolean;
  clicks: number;
  impressions: number;
}

export default function AdvertisementsAdminPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create/Edit Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [placement, setPlacement] = useState("HEADER");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/admin/advertisements");
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setImageUrl("");
    setTargetUrl("");
    setPlacement("HEADER");
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingId(ad.id);
    setName(ad.name);
    setPlacement(ad.placement);
    setImageUrl(ad.imageUrl);
    setTargetUrl(ad.targetUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/admin/advertisements/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, placement, imageUrl, targetUrl }),
        });
        if (res.ok) {
          resetForm();
          fetchAds();
        } else {
          throw new Error("Failed to update ad");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/advertisements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, placement, imageUrl, targetUrl, active: true }),
        });
        if (res.ok) {
          resetForm();
          fetchAds();
        } else {
          throw new Error("Failed to create ad");
        }
      }
    } catch (error) {
      console.error(error);
      alert(editingId ? "Error updating advertisement" : "Error creating advertisement");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });
      if (res.ok) {
        fetchAds();
      } else {
        throw new Error("Failed to update ad status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating advertisement status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) return;
    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAds();
      } else {
        throw new Error("Failed to delete ad");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting advertisement");
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b border-[#2E2E2E] pb-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center">
          <Megaphone size={28} className="mr-3 text-[#FF6B00]" /> Propaganda Network
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create/Edit Form */}
        <div className="lg:col-span-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase text-[#FF6B00]">
              {editingId ? "Edit Campaign" : "Deploy Campaign"}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-gray-500 hover:text-white" title="Cancel Edit">
                <X size={16} />
              </button>
            )}
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Campaign Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                placeholder="Summer Sale Promo"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Placement Zone</label>
              <select 
                value={placement} 
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
              >
                <option value="HEADER">HEADER</option>
                <option value="SIDEBAR">SIDEBAR</option>
                <option value="INLINE">INLINE</option>
                <option value="FOOTER">FOOTER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Image URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors font-mono text-xs"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Target URL</label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors font-mono text-xs"
                placeholder="https://..."
              />
            </div>
            
            <Button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white mt-6"
              themeObj={THEMES.dark}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : (editingId ? "Update Campaign" : <><Plus size={16} className="mr-2" /> Launch Campaign</>)}
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
          <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Active Operations</h2>
          {loading ? (
            <div className="flex justify-center p-8 text-gray-500"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id} className="p-4 border border-[#2E2E2E] rounded bg-[#0D0D0D] group flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-full md:w-32 h-20 bg-[#1A1A1A] border border-[#2E2E2E] rounded flex-shrink-0 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex space-x-2">
                        <Badge variant={ad.active ? "bhagwa" : "outline"} themeObj={THEMES.dark}>
                          {ad.active ? "ACTIVE" : "STANDBY"}
                        </Badge>
                        <Badge variant="default" themeObj={THEMES.dark} className="border-[#2E2E2E]">
                          {ad.placement}
                        </Badge>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleToggleActive(ad.id, ad.active)}
                          className={`p-2 rounded transition-colors ${ad.active ? 'text-green-500 hover:bg-green-500/10' : 'text-gray-500 hover:text-white hover:bg-[#2E2E2E]'}`}
                          title={ad.active ? "Deactivate" : "Activate"}
                        >
                          <Power size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(ad)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded hover:bg-[#2E2E2E]"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(ad.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-[#2E2E2E]"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-white text-lg leading-tight uppercase tracking-wide">{ad.name}</h3>
                    <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline font-mono truncate block max-w-sm mt-1">
                      {ad.targetUrl}
                    </a>
                    
                    <div className="flex space-x-6 mt-4 pt-4 border-t border-[#2E2E2E]">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Impressions</div>
                        <div className="text-white font-mono">{ad.impressions?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Clicks</div>
                        <div className="text-white font-mono">{ad.clicks?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">CTR</div>
                        <div className="text-[#FF6B00] font-mono">
                          {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : "0.00"}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {ads.length === 0 && (
                <div className="py-12 text-center text-gray-500 font-mono text-xs uppercase border border-dashed border-[#2E2E2E] rounded">
                  NO ACTIVE CAMPAIGNS.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
