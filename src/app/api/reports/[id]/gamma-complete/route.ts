import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CALLBACK_SECRET = process.env.N8N_CALLBACK_SECRET || 'default-secret-change-me';

interface GammaCompletePayload {
  gamma_url: string;
  gamma_embed_url: string;
  gamma_download_url?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('x-callback-secret');
    if (authHeader !== CALLBACK_SECRET) {
      console.error('[gamma-complete] Invalid callback secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: reportId } = await params;

    if (!reportId) {
      return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });
    }

    const body: GammaCompletePayload = await request.json();
    const { gamma_url, gamma_embed_url, gamma_download_url } = body;

    if (!gamma_embed_url) {
      return NextResponse.json(
        { error: 'Missing gamma_embed_url in request body' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from('reports')
      .update({
        research_status: 'completed',
        gamma_url: gamma_url || null,
        gamma_embed_url: gamma_embed_url,
        gamma_download_url: gamma_download_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (updateError) {
      console.error('[gamma-complete] Error updating report:', updateError);
      return NextResponse.json(
        { error: 'Failed to update report' },
        { status: 500 }
      );
    }

    console.log(`[gamma-complete] Gamma presentation ready for report ${reportId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[gamma-complete] Processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
