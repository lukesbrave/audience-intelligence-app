import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ReportPageClient } from './ReportPageClient';
import { DatabaseReport } from '@/lib/supabase/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !report) {
    notFound();
  }

  const dbReport = report as DatabaseReport;

  return (
    <ReportPageClient
      reportId={dbReport.id}
      initialStatus={dbReport.research_status}
      businessName={dbReport.name}
      createdAt={dbReport.created_at}
      gammaEmbedUrl={dbReport.gamma_embed_url}
      gammaDownloadUrl={dbReport.gamma_download_url}
      error={dbReport.research_error}
    />
  );
}
