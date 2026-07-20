import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

// POST /api/articles/[id]/view - Record a page view (no auth required)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get visitor IP and hash for privacy
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const ipHash = createHash('sha256')
      .update(ip + (process.env.NEXTAUTH_SECRET || 'salt'))
      .digest('hex')
      .substring(0, 16);
    const userAgent = request.headers.get('user-agent')?.substring(0, 200) || null;

    await prisma.view.create({
      data: { articleId: id, ipHash, userAgent }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);
    // Don't fail the page if view tracking fails
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
