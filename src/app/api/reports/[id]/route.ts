import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { SavedReport } from '@/lib/storage';
import { DatabaseReport } from '@/lib/supabase/types';

// Convert database report to SavedReport format for frontend compatibility
function toSavedReport(dbReport: DatabaseReport): SavedReport {
  return {
    id: dbReport.id,
    savedAt: dbReport.created_at,
    name: dbReport.name,
    request: {
      email: dbReport.request_email,
      pdfFilename: dbReport.request_pdf_filename,
      businessContext: dbReport.request_business_context,
      researchPriority: dbReport.request_research_priority,
    },
    response: dbReport.response_data,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report: toSavedReport(report) });
  } catch (error) {
    console.error('Report GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      updateData.name = body.name;
    }
    if (body.response_data !== undefined) {
      updateData.response_data = body.response_data;
    }
    if (body.google_doc_url !== undefined) {
      updateData.google_doc_url = body.google_doc_url;
    }

    const { data: report, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !report) {
      console.error('Error updating report:', error);
      return NextResponse.json(
        { error: 'Failed to update report' },
        { status: 500 }
      );
    }

    return NextResponse.json({ report: toSavedReport(report) });
  } catch (error) {
    console.error('Report PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase.from('reports').delete().eq('id', id);

    if (error) {
      console.error('Error deleting report:', error);
      return NextResponse.json(
        { error: 'Failed to delete report' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Report DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
