"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";
import { Badge } from "@/components/ui/Badge";

interface ShortNews {
  id: string;
  title: string;
  summary: string;
  type: string;
  priority: string;
  location: string | null;
  createdAt: string;
}

export default function ShortsAdminPage() {
  const [shorts, setShorts] = useState<ShortNews[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [type, setType] = useState("SIGINT");
  const [priority, setPriority] = useState("medium");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    try {
      const res = await fetch("/api/admin/shorts");
      const data = await res.json();
      setShorts(data);
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
      const res = await fetch("/api/admin/shorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, type, priority, location }),
      });
      if (res.ok) {
        setTitle("");
        setSummary("");
        setLocation("");
        setType("SIGINT");
        setPriority("medium");
        fetchShorts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-8 border-b border-[#2E2E2E] pb-4 flex items-center">
        <Zap size={28} className="mr-3 text-[#FF6B00]" /> Shorts Engine
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6 h-fit">
          <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Deploy Short Intel</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Headline</label>
              <input
                type="text"
                required
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                placeholder="Unusual Naval Activity..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Intel Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                  <option value="SIGINT">SIGINT</option>
                  <option value="CYBER">CYBER</option>
                  <option value="GEOINT">GEOINT</option>
                  <option value="HUMINT">HUMINT</option>
                  <option value="ALERT">ALERT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">CRITICAL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors font-mono text-sm uppercase"
                placeholder="INDIAN OCEAN REGION"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Summary (150 chars max)</label>
              <textarea
                required
                maxLength={200}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2E2E2E] rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors h-24 resize-none"
              ></textarea>
              <div className="text-right text-[10px] text-gray-500 font-mono mt-1">{summary.length}/200</div>
            </div>
            
            <Button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white"
              themeObj={THEMES.dark}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <><Zap size={16} className="mr-2" /> Broadcast</>}
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
          <h2 className="text-sm font-bold uppercase text-[#FF6B00] mb-4">Active Broadcasts</h2>
          {loading ? (
            <div className="flex justify-center p-8 text-gray-500"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              {shorts.map((s) => (
                <div key={s.id} className="p-4 border border-[#2E2E2E] rounded bg-[#0D0D0D] group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex space-x-2">
                      <Badge variant="outline" themeObj={THEMES.dark} className={s.priority === 'critical' ? 'border-red-500 text-red-500 animate-pulse' : ''}>{s.type}</Badge>
                      <Badge variant="outline" themeObj={THEMES.dark} className="border-[#2E2E2E]">{new Date(s.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Badge>
                    </div>
                    <button className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-lg leading-tight uppercase tracking-wide">{s.title}</h3>
                  <p className="text-sm text-gray-400 mt-2 font-serif">{s.summary}</p>
                  {s.location && (
                    <div className="mt-3 text-[10px] font-mono text-[#FF6B00] uppercase tracking-widest border-t border-[#2E2E2E] pt-2">
                      LOC: {s.location}
                    </div>
                  )}
                </div>
              ))}
              {shorts.length === 0 && (
                <div className="py-8 text-center text-gray-500 font-mono text-xs">NO ACTIVE SHORT BROADCASTS</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
