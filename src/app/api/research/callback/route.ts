import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ResearchResponse } from '@/lib/types';

// Secret key to validate callbacks from n8n
const CALLBACK_SECRET = process.env.N8N_CALLBACK_SECRET || 'default-secret-change-me';

export async function POST(request: Request) {
  try {
    // Validate the callback secret
    const authHeader = request.headers.get('x-callback-secret');
    if (authHeader !== CALLBACK_SECRET) {
      console.error('Invalid callback secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reportId, success, data, error: errorMessage } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: 'Missing reportId' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    if (success && data) {
      // Research completed successfully
      const researchData = data as ResearchResponse;

      // Try to update with new columns first, fall back to basic update if columns don't exist
      let updateError;

      // First try with research_status columns
      const result = await supabase
        .from('reports')
        .update({
          research_status: 'completed',
          response_data: researchData,
          google_doc_url: researchData.googleDocUrl || null,
          research_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (result.error?.message?.includes('research_status')) {
        // Columns don't exist - use basic update
        const fallbackResult = await supabase
          .from('reports')
          .update({
            response_data: researchData,
            google_doc_url: researchData.googleDocUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', reportId);
        updateError = fallbackResult.error;
      } else {
        updateError = result.error;
      }

      if (updateError) {
        console.error('Error updating report with success:', updateError);
        return NextResponse.json(
          { error: 'Failed to update report' },
          { status: 500 }
        );
      }

      console.log(`Research completed successfully for report ${reportId}`);
      return NextResponse.json({ success: true });
    } else {
      // Research failed - try to update with error columns if they exist
      const result = await supabase
        .from('reports')
        .update({
          research_status: 'error',
          research_error: errorMessage || 'Unknown error occurred',
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (result.error) {
        // If columns don't exist, just log the error
        console.error('Could not update report with error status:', result.error.message);
      }

      console.log(`Research failed for report ${reportId}: ${errorMessage}`);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
