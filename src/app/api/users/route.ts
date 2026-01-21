import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // Try to get existing user
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // User doesn't exist, create them
    if (selectError && selectError.code === 'PGRST116') {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({ email: normalizedEmail })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      return NextResponse.json({ user: newUser });
    }

    // Some other error occurred
    if (selectError) {
      console.error('Error fetching user:', selectError);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: existingUser });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
