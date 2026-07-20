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

    const sections = await prisma.pageSection.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Admin sections GET error:", error);
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, type, order, isVisible, configJson } = await request.json();

    if (!name || !type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }

    const section = await prisma.pageSection.create({
      data: {
        name,
        type,
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true,
        configJson,
      }
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("Section creation error:", error);
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Expecting an array of { id, order } for bulk updating order
    const updates = await request.json();
    
    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Expected an array of section updates" }, { status: 400 });
    }

    const updatePromises = updates.map((update: any) => {
      return prisma.pageSection.update({
        where: { id: update.id },
        data: { order: update.order }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bulk section update error:", error);
    return NextResponse.json({ error: "Failed to update sections" }, { status: 500 });
  }
}
