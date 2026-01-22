import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ResearchStatus } from '@/lib/supabase/types';

interface StatusResponse {
  status: ResearchStatus;
  error?: string;
  response?: unknown;
  googleDocUrl?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Try to get research_status columns, fall back to just response_data if migration not applied
    interface ReportWithStatus {
      research_status?: string;
      research_error?: string | null;
      response_data: unknown;
      google_doc_url: string | null;
    }

    let report: ReportWithStatus | null = null;
    let queryError;

    // First try with new columns
    const result = await supabase
      .from('reports')
      .select('research_status, research_error, response_data, google_doc_url')
      .eq('id', id)
      .single();

    if (result.error?.message?.includes('research_status')) {
      // Column doesn't exist - fall back to basic query
      const fallbackResult = await supabase
        .from('reports')
        .select('response_data, google_doc_url')
        .eq('id', id)
        .single();

      if (fallbackResult.data) {
        report = {
          response_data: fallbackResult.data.response_data,
          google_doc_url: fallbackResult.data.google_doc_url,
        };
      }
      queryError = fallbackResult.error;
    } else {
      report = result.data as ReportWithStatus | null;
      queryError = result.error;
    }

    if (queryError || !report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Determine status based on available data
    // If research_status column exists, use it; otherwise infer from response_data
    let status: ResearchStatus;

    if (report.research_status) {
      status = report.research_status as ResearchStatus;
    } else if (report.response_data) {
      // If we have response data, it's completed
      status = 'completed';
    } else {
      // No response data yet, still processing
      status = 'processing';
    }

    const response: StatusResponse = { status };

    if (status === 'error' && report.research_error) {
      response.error = report.research_error;
    }

    if (status === 'completed' && report.response_data) {
      response.response = report.response_data;
      if (report.google_doc_url) {
        response.googleDocUrl = report.google_doc_url;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
