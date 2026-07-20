import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const sections = await prisma.pageSection.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sections } = await request.json(); // Array of { id, name, type, order, isVisible, configJson }

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Process updates/creations in transaction
    await prisma.$transaction(
      sections.map((section, index) => {
        return prisma.pageSection.upsert({
          where: { id: section.id || 'new-id-' + index },
          update: {
            name: section.name,
            type: section.type,
            order: index,
            isVisible: section.isVisible !== undefined ? section.isVisible : true,
            configJson: section.configJson || null,
          },
          create: {
            name: section.name,
            type: section.type,
            order: index,
            isVisible: section.isVisible !== undefined ? section.isVisible : true,
            configJson: section.configJson || null,
          },
        });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving sections:', error);
    return NextResponse.json({ error: 'Failed to save sections' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.pageSection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
