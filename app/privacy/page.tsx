import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { PrivacyClient } from './PrivacyClient';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | Bharat First',
    description: 'Privacy Policy and data protection guidelines for Bharat First.',
  };
}

export default async function PrivacyPage() {
  let content = "";
  try {
    const settings = await prisma.setting.findMany({ where: { group: 'LEGAL' } });
    content = settings.find(s => s.key === 'privacy_policy')?.value || "";
  } catch {}
  return <PrivacyClient content={content} />;
}
