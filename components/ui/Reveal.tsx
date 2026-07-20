"use client";

import React from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  type?: 'slide-up' | 'scale' | 'fade';
  delay?: number;
  onClick?: () => void;
}

export const Reveal = ({ children, className = '', onClick }: RevealProps) => {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};
