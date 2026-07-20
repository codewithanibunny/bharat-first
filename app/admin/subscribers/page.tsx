"use client";

import { useState, useEffect } from "react";
import { Mail, Loader2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Search, Download, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

interface SubscribersResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SubscribersAdminPage() {
  const [data, setData] = useState<SubscribersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [processingBulk, setProcessingBulk] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchSubscribers(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const fetchSubscribers = async (pageNum: number, searchQuery: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/subscribers?page=${pageNum}&limit=20&search=${encodeURIComponent(searchQuery)}`);
      const responseData = await res.json();
      if (Array.isArray(responseData)) {
        setData({
          subscribers: responseData,
          total: responseData.length,
          page: 1,
          limit: responseData.length,
          totalPages: 1
        });
      } else {
        setData(responseData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      setSelectedIds(new Set(data.subscribers.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedIds.size === 0) return;
    
    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} operatives?`)) return;
    }

    setProcessingBulk(true);
    try {
      const res = await fetch('/api/admin/subscribers/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: Array.from(selectedIds) }),
      });
      
      if (res.ok) {
        setSelectedIds(new Set());
        fetchSubscribers(page, debouncedSearch);
      } else {
        throw new Error('Bulk action failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error executing bulk action');
    } finally {
      setProcessingBulk(false);
    }
  };

  const handleExportCSV = () => {
    if (!data || data.subscribers.length === 0) return;
    
    // Mock export using current page data
    const headers = ['ID', 'Email', 'Status', 'Date'];
    const csvRows = data.subscribers.map(sub => 
      `${sub.id},${sub.email},${sub.isActive ? 'Active' : 'Unsubscribed'},${new Date(sub.createdAt).toISOString()}`
    );
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `intel-operatives-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allSelected = (data?.subscribers?.length ?? 0) > 0 && selectedIds.size === data?.subscribers?.length;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b border-[#2E2E2E] pb-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center">
          <Mail size={28} className="mr-3 text-[#FF6B00]" /> Intelligence Network
        </h1>
        {data && (
          <div className="text-right">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Operatives</div>
            <div className="text-2xl font-black text-white">{data.total.toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="SEARCH CONTACT VECTORS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded pl-10 pr-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#FF6B00] transition-colors"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 mr-4 bg-[#1A1A1A] border border-[#2E2E2E] rounded p-1">
              <span className="text-xs font-bold text-[#FF6B00] px-2">{selectedIds.size} SELECTED</span>
              <button 
                onClick={() => handleBulkAction('activate')}
                disabled={processingBulk}
                className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-[#2E2E2E] rounded transition-colors" title="Activate Selected"
              >
                <ShieldCheck size={16} />
              </button>
              <button 
                onClick={() => handleBulkAction('deactivate')}
                disabled={processingBulk}
                className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-[#2E2E2E] rounded transition-colors" title="Deactivate Selected"
              >
                <ShieldAlert size={16} />
              </button>
              <div className="w-px h-4 bg-[#2E2E2E]"></div>
              <button 
                onClick={() => handleBulkAction('delete')}
                disabled={processingBulk}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-[#2E2E2E] rounded transition-colors" title="Delete Selected"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          
          <Button onClick={handleExportCSV} variant="outline" themeObj={THEMES.dark} className="flex items-center text-xs">
            <Download size={14} className="mr-2" /> EXPORT CSV
          </Button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
        {loading && !data ? (
          <div className="flex justify-center p-12 text-gray-500"><Loader2 className="animate-spin" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left relative">
                {loading && (
                  <div className="absolute inset-0 bg-[#1A1A1A]/50 flex justify-center pt-20 z-10">
                    <Loader2 className="animate-spin text-[#FF6B00]" />
                  </div>
                )}
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-[#2E2E2E]">
                    <th className="pb-3 px-4 w-12">
                      <input 
                        type="checkbox" 
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="accent-[#FF6B00] cursor-pointer"
                      />
                    </th>
                    <th className="pb-3 px-4">Contact Vector (Email)</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Intercept Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]">
                  {data?.subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#202020] transition-colors">
                      <td className="py-4 px-4">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(sub.id)}
                          onChange={(e) => handleSelectOne(sub.id, e.target.checked)}
                          className="accent-[#FF6B00] cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono text-white text-sm">{sub.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        {sub.isActive ? (
                          <span className="flex items-center text-xs font-bold text-green-500 uppercase">
                            <CheckCircle size={14} className="mr-1" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center text-xs font-bold text-red-500 uppercase">
                            <XCircle size={14} className="mr-1" /> Unsubscribed
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-400 font-mono">
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!data || data.subscribers.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500 font-mono text-xs uppercase">
                        NO CONTACTS FOUND IN DATABASE.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#2E2E2E]">
                <div className="text-xs text-gray-500 font-mono">
                  PAGE {data.page} OF {data.totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                    themeObj={THEMES.dark}
                    className="!px-3 !py-1"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                    variant="outline"
                    themeObj={THEMES.dark}
                    className="!px-3 !py-1"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
