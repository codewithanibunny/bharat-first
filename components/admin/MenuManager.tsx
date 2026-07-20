"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Save, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MenuItem {
  id?: string;
  title: string;
  url: string;
  target?: string;
  children?: MenuItem[];
}

export const MenuManager = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [selectedMenuIdx, setSelectedMenuIdx] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states for adding items
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuLocation, setNewMenuLocation] = useState('HEADER');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = () => {
    setLoading(true);
    fetch('/api/admin/menus')
      .then(res => res.json())
      .then(data => {
        setMenus(data);
        if (data.length > 0) {
          setMenuItems(data[0].items || []);
        } else {
          setMenuItems([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleMenuChange = (idx: number) => {
    setSelectedMenuIdx(idx);
    setMenuItems(menus[idx]?.items || []);
  };

  const handleAddItem = (e: React.FormEvent, parentIdx: number | null = null) => {
    e.preventDefault();
    if (!newItemTitle || !newItemUrl) return;

    const newItem: MenuItem = {
      title: newItemTitle,
      url: newItemUrl,
      target: '_self',
      children: []
    };

    setMenuItems(prev => {
      const updated = [...prev];
      if (parentIdx !== null) {
        if (!updated[parentIdx].children) updated[parentIdx].children = [];
        updated[parentIdx].children!.push(newItem);
      } else {
        updated.push(newItem);
      }
      return updated;
    });
    setNewItemTitle('');
    setNewItemUrl('');
  };

  const handleRemoveItem = (index: number, parentIdx: number | null = null) => {
    setMenuItems(prev => {
      const updated = [...prev];
      if (parentIdx !== null) {
        updated[parentIdx].children = updated[parentIdx].children!.filter((_, i) => i !== index);
      } else {
        return updated.filter((_, i) => i !== index);
      }
      return updated;
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down', parentIdx: number | null = null) => {
    setMenuItems(prev => {
      const updated = [...prev];
      const targetArray = parentIdx !== null ? updated[parentIdx].children! : updated;
      
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= targetArray.length) return updated;

      const temp = targetArray[index];
      targetArray[index] = targetArray[targetIdx];
      targetArray[targetIdx] = temp;
      
      return updated;
    });
  };

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName) return;
    try {
      const res = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMenuName, location: newMenuLocation })
      });
      if (res.ok) {
        setNewMenuName('');
        fetchMenus();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (menus.length === 0) return;
    setSaving(true);
    const activeMenu = menus[selectedMenuIdx];

    try {
      const res = await fetch(`/api/admin/menus/${activeMenu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: activeMenu.name,
          location: activeMenu.location,
          items: menuItems
        }),
      });

      if (res.ok) {
        alert('Menu saved successfully!');
        fetchMenus();
      } else {
        alert('Failed to save menu.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving menu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenu = async () => {
    if (menus.length === 0) return;
    if (!confirm('Are you sure you want to delete this menu?')) return;
    const activeMenu = menus[selectedMenuIdx];
    try {
      const res = await fetch(`/api/admin/menus/${activeMenu.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedMenuIdx(0);
        fetchMenus();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400 animate-pulse">Loading menu configuration...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Menu className="mr-3 text-[#FF6B00]" size={28} />
            Navigation Menu Builder
          </h1>
          <p className="text-gray-400 mt-2">Manage menus and links with nested hierarchy dynamically.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDeleteMenu} disabled={saving || menus.length === 0} variant="outline" themeObj={{ border: 'border-red-500/50', text: 'text-red-500', surfaceHover: 'bg-red-500/10' } as any}>
            <Trash2 size={18} className="mr-2" /> Delete Menu
          </Button>
          <Button onClick={handleSave} disabled={saving || menus.length === 0} variant="primary" themeObj={{ bg: 'bg-[#0D0D0D]', text: 'text-white', border: 'border-white/10' } as any}>
            {saving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Menu</>}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-[#171717] border border-white/10 rounded-sm p-4 items-end">
        {menus.length > 0 ? (
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Select Menu to Edit:</label>
            <select 
              value={selectedMenuIdx} 
              onChange={e => handleMenuChange(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/10 text-white rounded-sm px-3 py-2 focus:border-[#FF6B00] outline-none text-sm"
            >
              {menus.map((m, i) => (
                <option key={m.id} value={i}>{m.name} ({m.location})</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex-1 text-gray-500 text-sm py-2">No menus exist yet. Create one.</div>
        )}
        
        <form onSubmit={handleCreateMenu} className="flex-1 flex gap-2 items-end">
          <div className="flex-1">
             <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Create New Menu</label>
             <input type="text" placeholder="Menu Name" value={newMenuName} onChange={e => setNewMenuName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-[#FF6B00] outline-none" />
          </div>
          <Button type="submit" variant="outline" themeObj={{ border: 'border-white/10', text: 'text-white' } as any} className="py-2">
            <Plus size={16} />
          </Button>
        </form>
      </div>

      {menus.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Add Link form */}
          <div className="md:col-span-1 bg-[#171717] border border-white/10 rounded-sm p-6 h-fit space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">Add Custom Link</h3>
            <form onSubmit={e => handleAddItem(e)} className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Link Text</label>
                <input type="text" placeholder="e.g. OSINT Intel" value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Target URL</label>
                <input type="text" placeholder="e.g. /osint or https://..." value={newItemUrl} onChange={e => setNewItemUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-[#FF6B00] outline-none font-mono" />
              </div>
              <Button type="submit" variant="outline" themeObj={{ bg: 'bg-[#171717]', text: 'text-white', border: 'border-white/10', surfaceHover: 'bg-white/5' } as any} className="w-full py-2 flex items-center justify-center">
                <Plus size={16} className="mr-1" /> Add to Menu
              </Button>
            </form>
          </div>

          {/* Right: Menu Tree list */}
          <div className="md:col-span-2 bg-[#171717] border border-white/10 rounded-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">Menu Structure (Supports 1 Level Nesting)</h3>
            {menuItems.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">No items in this menu yet. Add some links from the left panel.</div>
            ) : (
              <div className="space-y-3">
                {menuItems.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between bg-black/40 border border-[#FF6B00]/20 rounded-sm p-3 shadow-[0_0_10px_rgba(255,107,0,0.05)]">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-white font-medium">{item.title}</span>
                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1"><ExternalLink size={10} /> {item.url}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button onClick={() => {
                          const title = prompt('Sub-item title:');
                          const url = prompt('Sub-item URL:');
                          if (title && url) {
                            setMenuItems(prev => {
                              const updated = [...prev];
                              if (!updated[idx].children) updated[idx].children = [];
                              updated[idx].children!.push({ title, url, target: '_self' });
                              return updated;
                            });
                          }
                        }} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-7 text-xs px-2 text-[#FF6B00] hover:text-[#FF6B00]">
                          + Sub Link
                        </Button>
                        <Button onClick={() => handleMove(idx, 'up')} disabled={idx === 0} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-7 w-7 text-gray-400 hover:text-white">
                          <ArrowUp size={14} />
                        </Button>
                        <Button onClick={() => handleMove(idx, 'down')} disabled={idx === menuItems.length - 1} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-7 w-7 text-gray-400 hover:text-white">
                          <ArrowDown size={14} />
                        </Button>
                        <Button onClick={() => handleRemoveItem(idx)} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-7 w-7 text-red-500 hover:bg-red-500/10">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    {/* Children */}
                    {item.children && item.children.length > 0 && (
                      <div className="pl-6 space-y-2 border-l-2 border-white/5 ml-3">
                        {item.children.map((child, childIdx) => (
                          <div key={childIdx} className="flex items-center justify-between bg-black/20 border border-white/5 rounded-sm p-2 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                              <CornerDownRight size={14} className="text-gray-500" />
                              <span className="text-sm text-gray-300 font-medium">{child.title}</span>
                              <span className="text-xs text-gray-600 font-mono flex items-center gap-1"><ExternalLink size={10} /> {child.url}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button onClick={() => handleMove(childIdx, 'up', idx)} disabled={childIdx === 0} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-6 w-6 text-gray-500 hover:text-white">
                                <ArrowUp size={12} />
                              </Button>
                              <Button onClick={() => handleMove(childIdx, 'down', idx)} disabled={childIdx === item.children!.length - 1} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-6 w-6 text-gray-500 hover:text-white">
                                <ArrowDown size={12} />
                              </Button>
                              <Button onClick={() => handleRemoveItem(childIdx, idx)} variant="ghost" themeObj={{ surfaceHover: 'bg-white/5' } as any} className="p-1 h-6 w-6 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
