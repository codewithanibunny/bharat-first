import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, location, items } = await request.json();

    if (!name || !location || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Use a transaction to delete old menu items and create/update menu structure
    const result = await prisma.$transaction(async (tx) => {
      // Upsert the menu first
      const menu = await tx.menu.upsert({
        where: { name },
        update: { location },
        create: { name, location },
      });

      // Clear existing items for this menu
      await tx.menuItem.deleteMany({
        where: { menuId: menu.id },
      });

      // Helper function to insert menu items recursively to preserve hierarchy
      const insertItems = async (menuItems: any[], parentId: string | null = null) => {
        for (let i = 0; i < menuItems.length; i++) {
          const item = menuItems[i];
          const createdItem = await tx.menuItem.create({
            data: {
              title: item.title,
              url: item.url,
              target: item.target || '_self',
              order: i,
              icon: item.icon || null,
              parentId: parentId,
              menuId: menu.id,
            },
          });

          if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            await insertItems(item.children, createdItem.id);
          }
        }
      };

      await insertItems(items);
      return menu;
    });

    return NextResponse.json({ success: true, menu: result });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Failed to save menu' }, { status: 500 });
  }
}
