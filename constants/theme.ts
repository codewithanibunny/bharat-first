import { ThemeObj } from '@/types';

export const THEMES: Record<string, ThemeObj> = {
  light: {
    name: 'light',
    bg: 'bg-[#FAFAF8]',
    surface: 'bg-white',
    surface2: 'bg-[#F3F2EE]',
    surfaceHover: 'hover:bg-[#F0EDE6]',
    border: 'border-[#E6E2DB]',
    borderHover: 'hover:border-[#FF6B00]',
    text: 'text-[#111111]',
    muted: 'text-[#5C5C5C]',
    subtle: 'text-[#888888]',
    inputBg: 'bg-white',
  },
  dark: {
    name: 'dark',
    bg: 'bg-[#0F0F0F]',
    surface: 'bg-[#171717]',
    surface2: 'bg-[#1E1E1E]',
    surfaceHover: 'hover:bg-[#252525]',
    border: 'border-[#2A2A2A]',
    borderHover: 'hover:border-[#FF6B00]',
    text: 'text-[#F5F5F0]',
    muted: 'text-[#A0A0A0]',
    subtle: 'text-[#6B6B6B]',
    inputBg: 'bg-[#171717]',
  }
};
