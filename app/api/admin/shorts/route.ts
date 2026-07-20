import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/shorts - Admin/Editor only
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shorts = await prisma.shortNews.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } }
    });
    return NextResponse.json(shorts);
  } catch (error) {
    console.error("Admin shorts GET error:", error);
    return NextResponse.json({ error: "Failed to fetch shorts" }, { status: 500 });
  }
}

// POST /api/admin/shorts - Create new short
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, summary, type, priority, location, categoryId } = await request.json();
    if (!title || !summary || !type) {
      return NextResponse.json({ error: "Title, summary, and type are required" }, { status: 400 });
    }

    const validTypes = ['SIGINT', 'CYBER', 'GEOINT', 'HUMINT', 'OSINT', 'GENERAL'];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const short = await prisma.shortNews.create({
      data: {
        title: title.trim(),
        summary: summary.trim(),
        type: validTypes.includes(type) ? type : 'GENERAL',
        priority: validPriorities.includes(priority) ? priority : 'MEDIUM',
        location: location?.trim() || null,
        categoryId: categoryId || null
      }
    });

    return NextResponse.json(short, { status: 201 });
  } catch (error) {
    console.error("Short creation error:", error);
    return NextResponse.json({ error: "Failed to create short" }, { status: 500 });
  }
}
