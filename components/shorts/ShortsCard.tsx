"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Short } from '@/types';
import { useAppContext } from '@/providers/AppProvider';

interface ShortsCardProps {
  short: Short;
}

export const ShortsCard = ({ short }: ShortsCardProps) => {
  const { themeObj } = useAppContext();
  const router = useRouter();

  const formattedTime = new Date(short.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`${themeObj.surface} border ${themeObj.border} border-l-2 border-l-[#FF6B00] rounded-sm p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:-translate-y-px hover:shadow-sm snap-center shrink-0 w-80 md:w-full`}
      onClick={() => router.push(`/short/${short.id}`)}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" themeObj={themeObj}>
            {short.type}
          </Badge>
          {short.priority === 'high' && (
            <Badge variant="bhagwa" themeObj={themeObj}>Urgent</Badge>
          )}
        </div>

        <h3 className={`text-base font-semibold ${themeObj.text} leading-snug mb-2 group-hover:text-[#FF6B00] transition-colors duration-300`}>
          {short.title}
        </h3>

        <p className={`text-sm ${themeObj.muted} font-[var(--font-playfair)] italic leading-relaxed line-clamp-3`}>
          {short.summary}
        </p>
      </div>

      <div className={`mt-5 pt-3 border-t ${themeObj.border} flex items-center justify-between text-[11px] ${themeObj.subtle}`}>
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {short.location || 'New Delhi'}
        </span>
        <span className="flex items-center gap-1" suppressHydrationWarning>
          <Clock size={11} />
          {formattedTime}
        </span>
      </div>
    </div>
  );
};
