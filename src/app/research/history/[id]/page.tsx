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
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !report) {
    notFound();
  }

  return <ReportDetailClient report={toSavedReport(report)} />;
}
