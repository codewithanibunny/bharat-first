import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { AboutClient } from './AboutClient';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  let title = 'About Us | Bharat First';
  let description = "Learn more about Bharat First - India's premier independent OSINT and geopolitical research platform.";
  try {
    const settings = await prisma.setting.findMany({ where: { group: 'SEO' } });
    const getSetting = (k: string, defaultVal: string) => settings.find(s => s.key === k)?.value || defaultVal;
    title = getSetting('meta_title', 'Bharat First') + ' | About Us';
  } catch {}

  return { title, description };
}

export default async function AboutPage() {
  try {
    await prisma.setting.findMany({ where: { group: 'GENERAL' } });
  } catch {}
  return <AboutClient />;
}
