import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: 'asc' },
          where: { parentId: null },
          include: {
            children: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Menu GET error:", error);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const { name, location, items } = await request.json();

    const menu = await prisma.menu.update({
      where: { id },
      data: {
        name,
        location,
      }
    });

    if (items && Array.isArray(items)) {
       await prisma.menuItem.deleteMany({
         where: { menuId: id }
       });

       const createPromises = items.map(async (item: any, index: number) => {
         const created = await prisma.menuItem.create({
           data: {
             title: item.title,
             url: item.url,
             target: item.target || "_self",
             order: index,
             icon: item.icon,
             menuId: menu.id,
           }
         });
         
         if (item.children && Array.isArray(item.children)) {
            const childPromises = item.children.map(async (child: any, childIndex: number) => {
               await prisma.menuItem.create({
                 data: {
                   title: child.title,
                   url: child.url,
                   target: child.target || "_self",
                   order: childIndex,
                   icon: child.icon,
                   parentId: created.id,
                   menuId: menu.id,
                 }
               });
            });
            await Promise.all(childPromises);
         }
       });

       await Promise.all(createPromises);
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Menu update error:", error);
    return NextResponse.json({ error: "Failed to update menu" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    await prisma.menu.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Menu deletion error:", error);
    return NextResponse.json({ error: "Failed to delete menu" }, { status: 500 });
  }
}
