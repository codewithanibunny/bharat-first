"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  UploadCloud, 
  Search, 
  Trash2, 
  Image as ImageIcon, 
  File as FileIcon,
  Video,
  FileText,
  X,
  Check
} from "lucide-react";

interface Media {
  id: string;
  filename: string;
  url: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export default function MediaEngine() {
  const [media, setMedia] = useState<Media[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/media", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (filter !== "all") url.searchParams.set("mimeType", filter);
      
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (error) {
      console.error("Error fetching media", error);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedia();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMedia]);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        fetchMedia();
      }
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map(m => m.id)));
    }
  };

  const bulkDelete = async () => {
    if (!confirm("Are you sure you want to delete selected files?")) return;
    
    try {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(
        idsToDelete.map(id => fetch(`/api/admin/media/${id}`, { method: "DELETE" }))
      );
      setSelectedIds(new Set());
      fetchMedia();
    } catch (error) {
      console.error("Error deleting media", error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderIcon = (mimeType: string) => {
    if (mimeType.includes("image")) return <ImageIcon className="w-8 h-8 text-orange-400" />;
    if (mimeType.includes("video")) return <Video className="w-8 h-8 text-orange-400" />;
    if (mimeType.includes("pdf") || mimeType.includes("text")) return <FileText className="w-8 h-8 text-orange-400" />;
    return <FileIcon className="w-8 h-8 text-orange-400" />;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              Media Engine <span className="text-orange-500">.</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Manage and organize your digital assets</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button 
                onClick={bulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Upload Zone */}
        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-out group
            ${isDragging ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-800 bg-zinc-900/50 hover:border-orange-500/50 hover:bg-zinc-900'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition-transform duration-300 ${isDragging ? 'scale-110 bg-orange-500/20' : 'bg-zinc-800'}`}>
              <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-orange-500' : 'text-zinc-400'}`} />
            </div>
            <div>
              <p className="text-lg font-medium text-white mb-1">
                {isDragging ? 'Drop your files here' : 'Drag & drop your files'}
              </p>
              <p className="text-zinc-500 text-sm">
                or click to browse from your computer
              </p>
            </div>
            <label className="relative cursor-pointer">
              <span className="px-6 py-2.5 bg-orange-500 text-black font-semibold rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:bg-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all inline-block">
                {isUploading ? 'Uploading...' : 'Select Files'}
              </span>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
            {['all', 'image', 'video', 'pdf'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap
                  ${filter === type 
                    ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              All Media
              <span className="text-xs py-0.5 px-2 bg-zinc-800 rounded-full text-zinc-400">{media.length}</span>
            </h2>
            <button 
              onClick={selectAll}
              className="text-sm text-zinc-400 hover:text-orange-500 transition-colors"
            >
              {selectedIds.size === media.length && media.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-zinc-900/50 rounded-xl animate-pulse border border-zinc-800/50"></div>
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-24 bg-zinc-900/20 rounded-2xl border border-zinc-800/50 border-dashed">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-4 text-zinc-600">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-zinc-400">No media files found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {media.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`group relative aspect-square rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 overflow-hidden bg-zinc-900/30
                    ${selectedIds.has(item.id) 
                      ? 'border-orange-500 bg-orange-500/5' 
                      : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'}`}
                >
                  <div className="absolute top-2 right-2 z-10">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                      ${selectedIds.has(item.id)
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-zinc-600 group-hover:border-zinc-400'}`}
                    >
                      {selectedIds.has(item.id) && <Check className="w-3 h-3 text-black" />}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    {renderIcon(item.mimeType)}
                  </div>
                  
                  <div className="mt-2 text-center w-full">
                    <p className="text-xs text-zinc-300 truncate w-full" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">
                      {formatSize(item.fileSize)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
