export type { Article, Category, ShortNews as Short } from '@prisma/client'

export interface WireDataItem {
  time: string;
  text: string;
  type: string;
}

export interface ThemeObj {
  name: string;
  bg: string;
  surface: string;
  surface2: string;
  surfaceHover: string;
  border: string;
  borderHover: string;
  text: string;
  muted: string;
  subtle: string;
  inputBg: string;
}
