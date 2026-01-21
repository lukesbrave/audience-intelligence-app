import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const appPassword = process.env.APP_PASSWORD;

    if (!appPassword) {
      console.error('APP_PASSWORD environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (password === appPassword) {
      const cookieStore = await cookies();

      // Set HTTP-only cookie for authentication
      cookieStore.set('ai-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.delete('ai-auth');

  return NextResponse.json({ success: true });
}
