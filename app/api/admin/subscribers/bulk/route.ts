import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { action, ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    if (action === 'delete') {
      await prisma.subscriber.deleteMany({
        where: { id: { in: ids } },
      });
    } else if (action === 'activate' || action === 'deactivate') {
      await prisma.subscriber.updateMany({
        where: { id: { in: ids } },
        data: { isActive: action === 'activate' },
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing bulk action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
