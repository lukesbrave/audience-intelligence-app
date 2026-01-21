import { SavedReport } from '../storage';

export async function fetchReports(email: string): Promise<SavedReport[]> {
  const response = await fetch(`/api/reports?email=${encodeURIComponent(email)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  const data = await response.json();
  return data.reports;
}

export async function fetchReport(id: string): Promise<SavedReport | null> {
  const response = await fetch(`/api/reports/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch report');
  }

  const data = await response.json();
  return data.report;
}

export async function deleteReportApi(id: string): Promise<void> {
  const response = await fetch(`/api/reports/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete report');
  }
}
