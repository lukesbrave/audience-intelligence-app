import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Secret key to validate callbacks from n8n
const CALLBACK_SECRET = process.env.N8N_CALLBACK_SECRET || 'default-secret-change-me';

export async function POST(request: Request) {
  try {
    // Validate the callback secret
    const authHeader = request.headers.get('x-callback-secret');
    if (authHeader !== CALLBACK_SECRET) {
      console.error('Invalid callback secret for gamma-complete');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reportId, gammaUrl, gammaEmbedUrl, gammaDownloadUrl } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: 'Missing reportId' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update the report with Gamma URLs
    // We need to update the response_data JSON field to add gamma URLs
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select('response_data')
      .eq('id', reportId)
      .single();

    if (fetchError || !report) {
      console.error('Error fetching report for gamma update:', fetchError);
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Update the response_data with gamma URLs
    const updatedResponseData = {
      ...(report.response_data as object),
      gammaUrl,
      gammaEmbedUrl,
      gammaDownloadUrl,
      gammaStatus: 'completed',
    };

    const { error: updateError } = await supabase
      .from('reports')
      .update({
        response_data: updatedResponseData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (updateError) {
      console.error('Error updating report with gamma URLs:', updateError);
      return NextResponse.json(
        { error: 'Failed to update report' },
        { status: 500 }
      );
    }

    console.log(`Gamma presentation completed for report ${reportId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gamma complete callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
