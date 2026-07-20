import { HomepageBuilder } from '@/components/admin/HomepageBuilder';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function HomepageBuilderPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="p-8 pb-32 max-w-[1200px] mx-auto w-full font-[var(--font-inter)]">
      <HomepageBuilder />
    </div>
  );
}
