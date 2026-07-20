import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (existing) {
      if (!existing.isActive) {
        await prisma.subscriber.update({
          where: { email },
          data: { isActive: true },
        });
        return NextResponse.json({ success: true, message: 'Welcome back! Subscription reactivated.' });
      }
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
    }

    await prisma.subscriber.create({ data: { email } });

    return NextResponse.json({ success: true, message: 'Successfully subscribed to Bharat First briefings' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await prisma.subscriber.updateMany({ where: { email }, data: { isActive: false } });
    return NextResponse.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
