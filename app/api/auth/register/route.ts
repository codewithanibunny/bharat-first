import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { rateLimiter } from '@/lib/rateLimit';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(60).optional(),
});

export async function POST(request: NextRequest) {
  // Apply strict rate limiting: 5 registrations per IP per hour
  const rateLimit = rateLimiter(request, { limit: 5, interval: 3600000, refillAmount: 5 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.reset / 1000)),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body = await request.json();

    // Strict input validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Return a generic error to prevent user enumeration attacks
      return NextResponse.json(
        { error: 'Registration failed. Please try a different email.' },
        { status: 400 }
      );
    }

    // bcrypt with cost factor 12 (strong, industry standard)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'GUEST', // Default role. Admin requires manual privilege escalation.
      },
    });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch {
    // Do not leak error details to the client
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
