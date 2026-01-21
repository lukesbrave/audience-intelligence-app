import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This route now triggers n8n asynchronously and returns immediately
// n8n will call our callback endpoint when done

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Validate authentication using Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { reportId, email, audienceProfile } = body;

    if (!reportId || !email || !audienceProfile) {
      return NextResponse.json(
        { error: 'Missing required fields: reportId, email, audienceProfile' },
        { status: 400 }
      );
    }

    // Get webhook URL from environment
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const callbackUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/research/callback`
      : `${request.headers.get('origin') || 'http://localhost:3000'}/api/research/callback`;
    const callbackSecret = process.env.N8N_CALLBACK_SECRET || 'default-secret-change-me';

    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Update report status to processing (if column exists)
    try {
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          research_status: 'processing',
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (updateError) {
        // Log but don't fail - the column might not exist yet
        console.warn('Could not update research_status (migration may not be applied):', updateError.message);
      }
    } catch (err) {
      // Silently continue - status tracking is optional
      console.warn('Error updating research status:', err);
    }

    // Fire and forget - trigger n8n webhook without waiting for response
    // n8n will call our callback endpoint when done
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        audienceProfile: audienceProfile,
        businessContext: `Target Audience: ${audienceProfile.audienceSummary}`,
        researchPriority: 'All Areas (Recommended)',
        fromOnboarding: true,
        // Include callback info for n8n to use
        reportId: reportId,
        callbackUrl: callbackUrl,
        callbackSecret: callbackSecret,
      }),
    }).catch((error) => {
      // Log error but don't fail the request - n8n might still process it
      console.error('Error triggering n8n webhook:', error);
    });

    // Return immediately - frontend will poll for status
    return NextResponse.json({
      success: true,
      reportId: reportId,
      message: 'Research started. Check status endpoint for updates.',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Research from onboarding API error:', errorMessage);
    return NextResponse.json(
      { error: `An unexpected error occurred: ${errorMessage}` },
      { status: 500 }
    );
  }
}
