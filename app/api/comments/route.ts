import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        },
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    // Organize into threads (parent-child)
    const threadMap: Record<string, any> = {};
    const rootComments: any[] = [];

    comments.forEach(comment => {
      threadMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
      if (comment.parentId) {
        if (threadMap[comment.parentId]) {
          threadMap[comment.parentId].replies.push(threadMap[comment.id]);
        }
      } else {
        rootComments.push(threadMap[comment.id]);
      }
    });

    return NextResponse.json(rootComments);
  } catch (error) {
    console.error("GET Comments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { articleId, content, parentId } = body;

    if (!articleId || !content) {
      return NextResponse.json({ error: "Article ID and content are required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        userId: session.user.id,
        parentId: parentId || null,
        isApproved: true, // auto-approve for now
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("POST Comment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
