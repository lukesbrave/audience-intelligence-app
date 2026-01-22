'use client';

import { useState } from 'react';
import { ResearchResponse } from '@/lib/types';

interface JsonExportPanelProps {
  response: ResearchResponse;
}

export function JsonExportPanel({ response }: JsonExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  // Create a clean export object without internal fields
  const exportData = {
    generatedAt: response.generatedAt,
    audienceProfile: response.report.audienceProfile,
    researchFindings: response.report.researchFindings,
    synthesis: response.report.synthesis,
    marketingStrategy: response.report.marketingStrategy,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const previewJson = showFull ? jsonString : jsonString.slice(0, 1500) + (jsonString.length > 1500 ? '\n...' : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audience-intelligence-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#243351] border border-slate-600/50 rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-slate-600/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Your Research Data
        </h2>
      </div>

      {/* Instructions */}
      <div className="px-6 py-4 bg-teal-500/10 border-b border-slate-600/50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-teal-300">Save this file securely</p>
            <p className="text-sm text-slate-400 mt-1">
              You&apos;ll need this data for the next step in the workflow. Copy it to your clipboard or download the file.
            </p>
          </div>
        </div>
      </div>

      {/* JSON Preview */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 bg-[#1a2744] rounded-xl p-4 overflow-hidden flex flex-col min-h-0">
          <pre className="flex-1 overflow-auto text-xs text-slate-300 font-mono whitespace-pre-wrap break-all">
            {previewJson}
          </pre>
          {jsonString.length > 1500 && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="mt-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              {showFull ? 'Show less' : 'Show full JSON'}
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
