"use client";

import React, { useState, useEffect } from 'react';
import { LayoutGrid, Save, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Section {
  id?: string;
  name: string;
  type: string;
  isVisible: boolean;
  order: number;
  configJson?: string | null;
}

const SECTION_TYPES = [
  { value: 'HERO', label: 'Featured Hero' },
  { value: 'SHORTS_GRID', label: 'Intelligence Shorts Grid' },
  { value: 'LATEST_REPORTS', label: 'Editorial Reports' },
  { value: 'LIVE_WIRE', label: 'Live Wire / Ticker' },
  { value: 'NEWSLETTER', label: 'Newsletter Signup' },
  { value: 'AD', label: 'Ad Placement Slot' }
];

export const HomepageBuilder = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [newSecName, setNewSecName] = useState('');
  const [newSecType, setNewSecType] = useState('HERO');

  useEffect(() => {
    fetch('/api/admin/sections')
      .then(res => res.json())
      .then(data => {
        setSections(data);
        setLoading(false);
      });
  }, []);

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecName) return;

    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSecName,
          type: newSecType,
          isVisible: true,
          order: sections.length
        }),
      });
      if (res.ok) {
        const newSection = await res.json();
        setSections(prev => [...prev, newSection]);
        setNewSecName('');
      } else {
        alert('Failed to add section');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding section');
    }
  };

  const handleToggleVisible = (index: number) => {
    setSections(prev => prev.map((sec, i) => i === index ? { ...sec, isVisible: !sec.isVisible } : sec));
  };

  const handleRemoveSection = async (index: number) => {
    const section = sections[index];
    if (section.id) {
      // If persisted, call delete API
      try {
        await fetch(`/api/admin/sections/${section.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error(err);
      }
    }
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    setSections(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          sections.map((sec, i) => ({
            id: sec.id,
            order: i,
            isVisible: sec.isVisible,
            name: sec.name,
            type: sec.type,
            configJson: sec.configJson
          }))
        ),
      });

      if (res.ok) {
        alert('Homepage configuration saved successfully!');
        window.location.reload();
      } else {
        alert('Failed to save configuration.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving homepage configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400 animate-pulse">Loading Homepage layout configuration...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <LayoutGrid className="mr-3 text-[#FF6B00]" size={28} />
            Homepage Section Builder
          </h1>
          <p className="text-gray-400 mt-2">Add, reorder, and configure blocks dynamically on the main homepage.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="primary" themeObj={{ bg: 'bg-[#0D0D0D]', text: 'text-white', border: 'border-white/10' } as any}>
          {saving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Layout</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add section */}
        <div className="md:col-span-1 bg-[#171717] border border-white/10 rounded-sm p-6 h-fit space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">Create Section</h3>
          <form onSubmit={handleAddSection} className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Section Name</label>
              <input type="text" placeholder="e.g. Editorial Feature Block" value={newSecName} onChange={e => setNewSecName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-[#FF6B00] outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Section Type</label>
              <select value={newSecType} onChange={e => setNewSecType(e.target.value)} className="w-full bg-black/50 border border-white/10 text-white rounded-sm px-3 py-2 text-sm focus:border-[#FF6B00] outline-none">
                {SECTION_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="outline" themeObj={{ bg: 'bg-[#171717]', text: 'text-white', border: 'border-white/10', surfaceHover: 'bg-white/5' } as any} className="w-full py-2 flex items-center justify-center">
              <Plus size={16} className="mr-1" /> Add Section
            </Button>
          </form>
        </div>

        {/* Re-ordering & list */}
        <div className="md:col-span-2 bg-[#171717] border border-white/10 rounded-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">Active Blocks (Top to Bottom)</h3>
          {sections.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">No sections on the homepage. Create one to begin.</div>
          ) : (
            <div className="space-y-2">
              {sections.map((sec, idx) => (
                <div key={idx} className={`flex items-center justify-between border rounded-sm p-3 transition-colors ${sec.isVisible ? 'bg-black/30 border-white/5 hover:border-white/10' : 'bg-black/10 border-white/5 opacity-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white font-medium">{sec.name}</span>
                    <span className="bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                      {sec.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button onClick={() => handleMove(idx, 'up')} disabled={idx === 0} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-7 w-7 text-gray-400 hover:text-white">
                      <ArrowUp size={14} />
                    </Button>
                    <Button onClick={() => handleMove(idx, 'down')} disabled={idx === sections.length - 1} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-7 w-7 text-gray-400 hover:text-white">
                      <ArrowDown size={14} />
                    </Button>
                    <Button onClick={() => handleToggleVisible(idx)} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-7 w-7 text-gray-400 hover:text-white">
                      {sec.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button onClick={() => handleRemoveSection(idx)} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-7 w-7 text-red-500 hover:bg-red-500/10">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
