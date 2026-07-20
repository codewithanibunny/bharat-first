import React from 'react';
import { ThemeObj } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'bhagwa' | 'outline' | 'danger';
  themeObj: ThemeObj;
  className?: string;
}

export const Badge = ({ children, variant = 'default', themeObj, className = '' }: BadgeProps) => {
  const variants = {
    default: `${themeObj.surface2} ${themeObj.muted} border ${themeObj.border}`,
    bhagwa: "bg-[#FF6B00] text-white border border-[#FF6B00]",
    outline: "text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/5",
    danger: "bg-red-900/10 text-red-600 border border-red-600/20",
  };

  return (
    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm inline-block ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
