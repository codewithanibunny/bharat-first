"use client";

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, MoreVertical, Download, Filter, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  searchable?: boolean;
  searchField?: keyof T;
  selectable?: boolean;
  onBulkDelete?: (selectedIds: string[]) => void;
  onExport?: (data: T[]) => void;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  searchable = true,
  searchField,
  selectable = true,
  onBulkDelete,
  onExport,
  pageSize = 10
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = useMemo(() => {
    if (!query || !searchField) return data;
    return data.filter(item => {
      const val = item[searchField];
      return String(val).toLowerCase().includes(query.toLowerCase());
    });
  }, [data, query, searchField]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else { setSortKey(null); setSortDir('asc'); }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(new Set(paginatedData.map(d => String(d[keyField]))));
    } else {
      setSelected(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const themeObj = {
    bg: 'bg-[#0F0F0F]', surface: 'bg-[#171717]', surface2: 'bg-[#1E1E1E]', surfaceHover: 'bg-[#252525]',
    text: 'text-[#F5F5F0]', muted: 'text-[#6B6B6B]', subtle: 'text-[#444444]', border: 'border-[#2A2A2A]',
    inputBg: 'bg-[#171717]', primary: '#FF6B00'
  };

  return (
    <div className={`border ${themeObj.border} rounded overflow-hidden flex flex-col ${themeObj.surface}`}>
      
      {/* Toolbar */}
      <div className={`p-4 border-b ${themeObj.border} flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111]`}>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {searchable && searchField && (
            <div className={`relative flex items-center w-full sm:w-64`}>
              <Search size={14} className={`absolute left-3 ${themeObj.muted}`} />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={e => { setQuery(e.target.value); setCurrentPage(1); }}
                className={`w-full bg-[#1A1A1A] border ${themeObj.border} rounded px-9 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors`}
              />
            </div>
          )}
          <button className={`p-2 border ${themeObj.border} rounded text-gray-400 hover:text-white transition-colors bg-[#1A1A1A]`}>
            <Filter size={14} />
          </button>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {selected.size > 0 && onBulkDelete && (
            <button 
              onClick={() => onBulkDelete(Array.from(selected))}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-500 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors flex items-center"
            >
              <Trash2 size={12} className="mr-2" /> Delete ({selected.size})
            </button>
          )}
          {onExport && (
            <button 
              onClick={() => onExport(sortedData)}
              className={`p-2 border ${themeObj.border} rounded text-gray-400 hover:text-white transition-colors bg-[#1A1A1A]`}
              title="Export CSV"
            >
              <Download size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-[10px] font-black uppercase tracking-widest text-gray-500 border-b ${themeObj.border} bg-[#0D0D0D]`}>
              {selectable && (
                <th className="py-3 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={paginatedData.length > 0 && selected.size === paginatedData.length}
                    onChange={handleSelectAll}
                    className="accent-[#FF6B00]"
                  />
                </th>
              )}
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={`py-3 px-4 whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key as string)}
                >
                  <div className="flex items-center">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className="ml-1 text-[#FF6B00]">
                        {sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${themeObj.border} bg-[#141414]`}>
            {paginatedData.map((row, rowIndex) => {
              const id = String(row[keyField]);
              const isSelected = selected.has(id);
              return (
                <tr 
                  key={id} 
                  className={`hover:bg-[#1C1C1C] transition-colors group ${isSelected ? 'bg-[#FF6B00]/5' : ''}`}
                >
                  {selectable && (
                    <td className="py-3 px-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(id, e.target.checked)}
                        className="accent-[#FF6B00]"
                      />
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-3 px-4 text-sm text-gray-300">
                      {col.cell ? col.cell(row) : String(row[col.key as keyof T] || '')}
                    </td>
                  ))}
                </tr>
              );
            })}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-16 text-center">
                  <div className="text-gray-500 font-mono text-xs uppercase tracking-widest">
                    No records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`p-4 border-t ${themeObj.border} flex items-center justify-between bg-[#111]`}>
          <div className="text-xs text-gray-500 font-mono">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded border ${themeObj.border} bg-[#1A1A1A] text-gray-400 hover:text-white disabled:opacity-50 transition-colors`}
            >
              <ArrowLeft size={14} />
            </button>
            <span className="text-xs font-bold text-white px-2">{currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded border ${themeObj.border} bg-[#1A1A1A] text-gray-400 hover:text-white disabled:opacity-50 transition-colors`}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
