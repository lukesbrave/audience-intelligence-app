'use client';

import { useState, FormEvent } from 'react';
import { Button, Input, FileUpload } from '@/components/ui';

interface FormData {
  email: string;
  pdfFile: File | null;
  pdfBase64: string;
  pdfFilename: string;
}

interface FormErrors {
  email?: string;
  pdf?: string;
}

interface ResearchFormProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  darkMode?: boolean;
}

function ResearchForm({ onSubmit, loading = false, darkMode = false }: ResearchFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    pdfFile: null,
    pdfBase64: '',
    pdfFilename: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.pdfFile) {
      newErrors.pdf = 'Please upload a PDF file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleFileSelect = (file: File, base64: string) => {
    setFormData((prev) => ({
      ...prev,
      pdfFile: file,
      pdfBase64: base64,
      pdfFilename: file.name,
    }));
    setErrors((prev) => ({ ...prev, pdf: undefined }));
  };

  const handleFileError = (message: string) => {
    setErrors((prev) => ({ ...prev, pdf: message }));
  };

  const handleFileClear = () => {
    setFormData((prev) => ({
      ...prev,
      pdfFile: null,
      pdfBase64: '',
      pdfFilename: '',
    }));
  };

  if (darkMode) {
    return (
      <div className="bg-[#243351] border border-slate-600/50 rounded-2xl p-8 md:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Start Your Research</h2>
          <p className="text-sm text-slate-400">
            This takes a few minutes — we&apos;re doing proper intelligence work, not a quick scan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">
              Email Address
              <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={loading}
              className={`
                w-full px-4 py-3 rounded-lg bg-[#1a2744] border text-white placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                ${errors.email ? 'border-red-500' : 'border-slate-600'}
              `}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
            )}
            {!errors.email && (
              <p className="mt-1.5 text-sm text-slate-500">We&apos;ll send your full report here too</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">
              Your Audience Profile
              <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>
            </label>
            {formData.pdfFile ? (
              <div className={`
                flex items-center justify-between p-4 rounded-lg border bg-[#1a2744]
                ${errors.pdf ? 'border-red-500' : 'border-slate-600'}
              `}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#0d9488]/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[#0d9488]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {formData.pdfFile.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(formData.pdfFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                {!loading && (
                  <button
                    type="button"
                    onClick={handleFileClear}
                    className="flex-shrink-0 p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors"
                    aria-label="Remove file"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div
                role="button"
                tabIndex={loading ? -1 : 0}
                onClick={() => {
                  if (!loading) {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const base64 = (reader.result as string).split(',')[1];
                          handleFileSelect(file, base64);
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }
                }}
                onKeyDown={(e) => {
                  if (!loading && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    (e.target as HTMLElement).click();
                  }
                }}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors focus:outline-none focus:ring-2 focus:ring-[#0d9488]
                  ${loading
                    ? 'border-slate-700 bg-slate-800/50 cursor-not-allowed'
                    : errors.pdf
                      ? 'border-red-500/50 hover:border-red-500 bg-red-500/10'
                      : 'border-slate-600 hover:border-[#0d9488] hover:bg-[#0d9488]/10'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    loading ? 'bg-slate-700' : 'bg-[#0d9488]/20'
                  }`}>
                    <svg
                      className={`w-6 h-6 ${loading ? 'text-slate-500' : 'text-[#0d9488]'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Drop your PDF here or <span className="text-[#0d9488]">click to browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PDF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            )}
            {errors.pdf && (
              <p className="mt-1.5 text-sm text-red-400">{errors.pdf}</p>
            )}
            {!errors.pdf && !formData.pdfFile && (
              <p className="mt-1.5 text-sm text-slate-500">The profile you created in the previous step</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.pdfFile}
              className={`
                w-full py-3.5 px-6 rounded-lg font-medium text-white
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#243351]
                ${loading || !formData.email || !formData.pdfFile
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-[#0d9488] hover:bg-[#0f766e] focus:ring-[#0d9488]'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Run Intelligence Report'
              )}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500">
            <span role="img" aria-label="clock">⏱</span> Takes 3-5 minutes · <span role="img" aria-label="coffee">☕</span> Good time for a coffee
          </p>
        </form>
      </div>
    );
  }

  // Original light mode form
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Start New Research</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload your audience profile PDF and we&apos;ll generate comprehensive research insights
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email Address"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          hint="Research report will be sent to this email"
          required
          disabled={loading}
        />

        <FileUpload
          label="Audience Profile PDF"
          accept=".pdf"
          maxSizeMB={10}
          onFileSelect={handleFileSelect}
          onError={handleFileError}
          onClear={handleFileClear}
          currentFile={
            formData.pdfFile
              ? { name: formData.pdfFile.name, size: formData.pdfFile.size }
              : null
          }
          error={errors.pdf}
          hint="Upload a PDF with your target audience information"
          required
          disabled={loading}
        />

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={!formData.email || !formData.pdfFile}
          >
            Start Research
          </Button>
        </div>
      </form>
    </div>
  );
}

export { ResearchForm };
export type { FormData as ResearchFormData, ResearchFormProps };
