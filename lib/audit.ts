import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function logAudit(action: string, resource: string, details?: string) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // In a real app we'd get the IP address from headers, 
    // but Next.js App Router doesn't make this trivial outside of Route Handlers.
    // So we just log the action and user for now.
    
    await prisma.auditLog.create({
      data: {
        action,
        resource,
        details,
        userId,
      }
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
}
