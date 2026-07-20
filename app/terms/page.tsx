import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { TermsClient } from './TermsClient';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service | Bharat First',
    description: 'Terms of Service and user agreements for Bharat First.',
  };
}

export default async function TermsPage() {
  let content = "";
  try {
    const settings = await prisma.setting.findMany({ where: { group: 'LEGAL' } });
    content = settings.find(s => s.key === 'terms_of_service')?.value || "";
  } catch {}
  return <TermsClient content={content} />;
}
