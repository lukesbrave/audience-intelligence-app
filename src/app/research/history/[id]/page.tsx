import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ReportDetailClient } from './ReportDetailClient';
import { SavedReport } from '@/lib/storage';
import { DatabaseReport } from '@/lib/supabase/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

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

export default async function ReportDetailPage({ params }: PageProps) {
  try {
    const { id } = await params;
    console.log('[ReportDetailPage] Starting, id:', id);

    const supabase = await createClient();
    console.log('[ReportDetailPage] Supabase client created');

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('[ReportDetailPage] Auth check - user:', user?.id, 'error:', authError?.message);

    if (!user) {
      console.log('[ReportDetailPage] No user, redirecting to login');
      redirect('/login');
    }

    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      notFound();
    }

    if (!report) {
      notFound();
    }

    return <ReportDetailClient report={toSavedReport(report as DatabaseReport)} />;
  } catch (err) {
    console.error('ReportDetailPage error:', err);
    notFound();
  }
}
