import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const menus = await prisma.menu.findMany({
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
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(menus);
  } catch (error) {
    console.error("Admin menus GET error:", error);
    return NextResponse.json({ error: "Failed to fetch menus" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, location } = await request.json();

    if (!name || !location) {
      return NextResponse.json({ error: "Name and location are required" }, { status: 400 });
    }

    const existing = await prisma.menu.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Menu with this name already exists" }, { status: 409 });
    }

    const menu = await prisma.menu.create({
      data: { name, location }
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error("Menu creation error:", error);
    return NextResponse.json({ error: "Failed to create menu" }, { status: 500 });
  }
}
