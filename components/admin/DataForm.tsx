"use client";

import React, { useState, useEffect } from 'react';
import { Save, FileText, ArrowLeft, History, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface DataFormProps {
  title: string;
  backUrl?: string;
  isSaving: boolean;
  onSave: (isDraft: boolean) => Promise<void>;
  onAutoSave?: () => Promise<void>;
  lastSavedAt?: Date | null;
  children: React.ReactNode;
}

export function DataForm({
  title,
  backUrl,
  isSaving,
  onSave,
  onAutoSave,
  lastSavedAt,
  children
}: DataFormProps) {
  const router = useRouter();
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Auto-save effect
  useEffect(() => {
    if (!onAutoSave) return;
    const interval = setInterval(async () => {
      setAutoSaveStatus('saving');
      try {
        await onAutoSave();
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      } catch (e) {
        setAutoSaveStatus('idle');
      }
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [onAutoSave]);

  const themeObj = {
    name: 'admin-dark',
    bg: 'bg-[#0F0F0F]', surface: 'bg-[#171717]', surface2: 'bg-[#1E1E1E]', surfaceHover: 'bg-[#252525]',
    text: 'text-[#F5F5F0]', muted: 'text-[#6B6B6B]', subtle: 'text-[#444444]', border: 'border-[#2A2A2A]',
    borderHover: 'hover:border-[#FF6B00]', inputBg: 'bg-[#1A1A1A]',
    primary: '#FF6B00'
  };

  return (
    <form className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-6rem)]" onSubmit={e => e.preventDefault()}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-40 ${themeObj.surface} border-b ${themeObj.border} px-6 py-4 flex items-center justify-between mb-6 shadow-sm`}>
        <div className="flex items-center space-x-4">
          {backUrl && (
            <button 
              onClick={() => router.push(backUrl)}
              className={`p-2 rounded-full ${themeObj.surfaceHover} hover:text-white transition-colors text-gray-400`}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <h1 className="text-xl font-black uppercase tracking-widest text-white">{title}</h1>
          
          {autoSaveStatus === 'saving' && (
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest flex items-center bg-[#222] px-2 py-1 rounded">
              <Loader2 size={10} className="mr-1.5 animate-spin" /> Auto-saving
            </span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="text-[10px] text-[#FF6B00] font-mono uppercase tracking-widest flex items-center bg-[#FF6B00]/10 px-2 py-1 rounded">
              <CheckCircle2 size={10} className="mr-1.5" /> Saved
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {lastSavedAt && (
            <div className="text-[10px] text-gray-500 font-mono hidden md:flex items-center mr-2">
              <History size={12} className="mr-1.5" /> 
              Last saved: {new Date(lastSavedAt).toLocaleTimeString()}
            </div>
          )}
          
          <Button 
            variant="outline" 
            themeObj={themeObj}
            onClick={() => onSave(true)}
            disabled={isSaving}
            className="text-xs"
          >
            <FileText size={14} className="mr-2" />
            Save Draft
          </Button>
          
          <Button 
            variant="primary" 
            themeObj={themeObj}
            onClick={() => onSave(false)}
            disabled={isSaving}
            className="text-xs"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
            Publish
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 pb-20 flex-1 overflow-y-auto hide-scrollbar">
        {children}
      </div>
    </form>
  );
}
