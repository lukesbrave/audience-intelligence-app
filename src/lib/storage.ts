import { ResearchResponse } from './types';

const STORAGE_KEY = 'audience-intel-reports';
const MAX_REPORTS = 50;

export interface SavedReport {
  id: string;
  savedAt: string;
  name: string;
  request: {
    email: string;
    pdfFilename: string;
    businessContext: string;
    researchPriority: string;
  };
  response: ResearchResponse;
}

interface StoredData {
  version: 1;
  reports: SavedReport[];
}

function generateId(): string {
  return `report-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function saveReport(
  request: SavedReport['request'],
  response: ResearchResponse,
  customName?: string
): SavedReport {
  const report: SavedReport = {
    id: generateId(),
    savedAt: new Date().toISOString(),
    name: customName || `Research - ${new Date().toLocaleDateString()}`,
    request,
    response,
  };

  const data = loadAllReports();
  data.unshift(report); // Newest first

  // Trim to max
  if (data.length > MAX_REPORTS) {
    data.pop();
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, reports: data })
    );
  }

  return report;
}

export function loadAllReports(): SavedReport[] {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const data: StoredData = JSON.parse(raw);
    return data.reports || [];
  } catch {
    return [];
  }
}

export function getReport(id: string): SavedReport | null {
  return loadAllReports().find((r) => r.id === id) || null;
}

export function deleteReport(id: string): void {
  if (typeof window === 'undefined') return;

  const data = loadAllReports().filter((r) => r.id !== id);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 1, reports: data })
  );
}

export function clearAllReports(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
