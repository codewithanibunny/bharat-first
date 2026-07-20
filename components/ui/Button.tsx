"use client";

import React from 'react';
import { ThemeObj } from '@/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  themeObj: ThemeObj;
  className?: string;
}

export const Button = ({ children, variant = 'primary', themeObj, className = '', ...props }: ButtonProps) => {
  const baseStyle = "px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-all duration-300 flex items-center justify-center rounded-sm border disabled:opacity-50";

  const variants = {
    primary: "bg-[#FF6B00] text-white border-[#FF6B00] hover:bg-[#E65100] hover:border-[#E65100]",
    secondary: "bg-transparent text-[#FF6B00] border-[#FF6B00] hover:bg-[#FF6B00]/5",
    outline: `bg-transparent ${themeObj.text} ${themeObj.border} hover:border-[#FF6B00] hover:text-[#FF6B00]`,
    ghost: `bg-transparent ${themeObj.muted} border-transparent hover:${themeObj.surfaceHover}`,
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
