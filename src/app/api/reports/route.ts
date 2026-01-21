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

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (userError || !user) {
      // No user means no reports
      return NextResponse.json({ reports: [] });
    }

    // Get their reports
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (reportsError) {
      console.error('Error fetching reports:', reportsError);
      return NextResponse.json(
        { error: 'Failed to fetch reports' },
        { status: 500 }
      );
    }

    // Convert to frontend format
    const savedReports = (reports || []).map(toSavedReport);

    return NextResponse.json({ reports: savedReports });
  } catch (error) {
    console.error('Reports GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      pdfFilename,
      businessContext,
      researchPriority,
      response,
    } = body;

    if (!email || !response) {
      return NextResponse.json(
        { error: 'Email and response data required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // Get or create user
    let userId: string;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ email: normalizedEmail })
        .select('id')
        .single();

      if (createError || !newUser) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
      userId = newUser.id;
    }

    // Create the report
    const reportName = name || `Research - ${new Date().toLocaleDateString()}`;

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        name: reportName,
        request_email: normalizedEmail,
        request_pdf_filename: pdfFilename || '',
        request_business_context: businessContext || '',
        request_research_priority: researchPriority || 'All Areas (Recommended)',
        response_data: response,
        google_doc_url: response.googleDocUrl || null,
      })
      .select()
      .single();

    if (reportError || !report) {
      console.error('Error creating report:', reportError);
      return NextResponse.json(
        { error: 'Failed to create report' },
        { status: 500 }
      );
    }

    // Return in frontend format
    return NextResponse.json({ report: toSavedReport(report) });
  } catch (error) {
    console.error('Reports POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
