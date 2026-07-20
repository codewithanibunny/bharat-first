import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');

    // Public clients may only read safe setting groups.
    // All other groups (SEO, CONTACT, API, SOCIAL) require admin authentication.
    const publicGroups = ['THEME', 'FEATURES'];

    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'ADMIN';

    const settings = await prisma.setting.findMany({
      where: group
        ? { group }
        : isAdmin
          ? undefined // Admins see everything
          : { group: { in: publicGroups } }, // Public sees only safe groups
    });

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { settings } = data; // Expecting { settings: [{ key, value, group, type }] }

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Upsert each setting
    for (const setting of settings) {
      if (setting.key) {
        await prisma.setting.upsert({
          where: { key: setting.key },
          update: { 
            value: setting.value,
            ...(setting.group && { group: setting.group }),
            ...(setting.type && { type: setting.type }),
          },
          create: {
            key: setting.key,
            value: setting.value,
            group: setting.group || 'GENERAL',
            type: setting.type || 'TEXT',
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
