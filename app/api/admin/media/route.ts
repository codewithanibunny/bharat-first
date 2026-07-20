import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const mimeType = searchParams.get("mimeType");

    const where: any = {};
    
    if (search) {
      where.filename = { contains: search, mode: "insensitive" };
    }
    
    if (mimeType && mimeType !== "all") {
      where.mimeType = { contains: mimeType, mode: "insensitive" };
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const url = formData.get("url") as string;
    
    if (file) {
      // Mock local upload
      const filename = file.name;
      const mimeType = file.type;
      const fileSize = file.size;
      const fakeUrl = `/uploads/mock-${Date.now()}-${filename}`;
      
      const media = await prisma.media.create({
        data: {
          filename,
          url: fakeUrl,
          fileSize,
          mimeType,
          folder: "root"
        }
      });
      return NextResponse.json(media, { status: 201 });
    } else if (url) {
      // Mock URL upload
      const filename = url.split("/").pop() || "unknown";
      const media = await prisma.media.create({
        data: {
          filename,
          url,
          fileSize: 0,
          mimeType: "image/jpeg", // Defaulting to jpeg for mocked URL
          folder: "root"
        }
      });
      return NextResponse.json(media, { status: 201 });
    }

    return NextResponse.json({ error: "No file or URL provided" }, { status: 400 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
