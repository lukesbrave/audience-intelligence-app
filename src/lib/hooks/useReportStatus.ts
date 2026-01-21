'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DatabaseReport, ResearchStatus } from '@/lib/supabase/types';

interface ReportStatus {
  id: string;
  status: ResearchStatus;
  gammaUrl: string | null;
  gammaEmbedUrl: string | null;
  gammaDownloadUrl: string | null;
  businessName: string;
  createdAt: string;
  error: string | null;
}

interface UseReportStatusResult {
  report: ReportStatus | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useReportStatus(reportId: string): UseReportStatusResult {
  const [report, setReport] = useState<ReportStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformReport = useCallback((dbReport: DatabaseReport): ReportStatus => {
    return {
      id: dbReport.id,
      status: dbReport.research_status,
      gammaUrl: dbReport.gamma_url,
      gammaEmbedUrl: dbReport.gamma_embed_url,
      gammaDownloadUrl: dbReport.gamma_download_url,
      businessName: dbReport.name,
      createdAt: dbReport.created_at,
      error: dbReport.research_error,
    };
  }, []);

  const fetchReport = useCallback(async () => {
    const supabase = createClient();

    const { data, error: fetchError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    if (data) {
      setReport(transformReport(data as DatabaseReport));
    }
    setIsLoading(false);
  }, [reportId, transformReport]);

  useEffect(() => {
    fetchReport();

    const supabase = createClient();

    const channel = supabase
      .channel(`report-${reportId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reports',
          filter: `id=eq.${reportId}`,
        },
        (payload) => {
          const updatedReport = payload.new as DatabaseReport;
          setReport(transformReport(updatedReport));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reportId, fetchReport, transformReport]);

  return { report, isLoading, error, refetch: fetchReport };
}
