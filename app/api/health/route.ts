import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 *
 * Health check endpoint for load balancers, container orchestrators (K8s),
 * and uptime monitoring tools (e.g., UptimeRobot, Datadog, AWS ALB).
 *
 * Returns 200 if the application and database are healthy.
 * Returns 503 if any critical dependency is unavailable.
 */
export async function GET() {
  const startTime = Date.now();

  // Check database connectivity
  let dbStatus: 'ok' | 'error' = 'ok';
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch {
    dbStatus = 'error';
  }

  const totalLatencyMs = Date.now() - startTime;
  const isHealthy = dbStatus === 'ok';

  const payload = {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'production',
    uptime: process.uptime(),
    latencyMs: totalLatencyMs,
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
    },
  };

  return NextResponse.json(payload, {
    status: isHealthy ? 200 : 503,
    headers: {
      // Never cache health checks — load balancers need real-time data
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
