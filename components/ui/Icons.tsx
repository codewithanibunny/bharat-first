import React from 'react';

export const IndiaMapWatermark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M42,8 L48,4 L56,6 L62,12 L66,22 L70,30 L74,42 L76,54 L74,66 L68,78 L60,88 L52,100 L48,108 L44,100 L38,88 L32,76 L28,64 L24,52 L22,42 L20,34 L18,28 L22,18 L30,12 Z"
      opacity="0.6"
    />
  </svg>
);

export const AshokaChakra = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="50" cy="50" r="46" />
    <circle cx="50" cy="50" r="6" fill="currentColor" stroke="none" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1="50" y1="50" x2="50" y2="6" transform={`rotate(${i * 15} 50 50)`} />
    ))}
  </svg>
);

export const ChakraDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px bg-current opacity-15" />
    <AshokaChakra size={14} className="opacity-20 shrink-0" />
    <div className="flex-1 h-px bg-current opacity-15" />
  </div>
);
