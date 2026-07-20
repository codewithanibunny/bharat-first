import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const shorts = await prisma.shortNews.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const wireData = shorts.map(short => ({
      id: short.id,
      time: new Date(short.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: short.title,
      type: short.type.toLowerCase(),
    }));

    return NextResponse.json(wireData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wire data" }, { status: 500 });
  }
}
