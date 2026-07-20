import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Next.js 16 Proxy (formerly Middleware).
 * Protects /admin/* routes by verifying the NextAuth JWT token at the edge.
 * This runs before any page or API route is reached.
 *
 * Migration note: Next.js 16 renamed `middleware` -> `proxy`.
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Not authenticated — redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated but insufficient role — redirect to homepage
    const role = token.role as string;
    if (!['ADMIN', 'EDITOR'].includes(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match /admin and all sub-paths only
  matcher: ['/admin/:path*'],
};
