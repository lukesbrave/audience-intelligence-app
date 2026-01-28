'use client';

import { useCallback, useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File, base64: string) => void;
  onError: (message: string) => void;
  onClear?: () => void;
  currentFile?: { name: string; size: number } | null;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: 'light' | 'dark';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUpload({
  accept = '.txt,.json',
  maxSizeMB = 10,
  onFileSelect,
  onError,
  onClear,
  currentFile,
  label = 'Upload File',
  hint,
  error,
  required = false,
  disabled = false,
  variant = 'light',
}: FileUploadProps) {
  const isDark = variant === 'dark';
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      // Validate file type
      const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isValidType = acceptedTypes.some(
        (type) =>
          type === fileExtension ||
          type === file.type ||
          (type.endsWith('/*') && file.type.startsWith(type.replace('/*', '')))
      );

      if (!isValidType) {
        onError(`Please upload a valid file type: ${accept}`);
        return;
      }

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        onError(`File must be under ${maxSizeMB}MB`);
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onFileSelect(file, base64);
      };
      reader.onerror = () => {
        onError('Failed to read file');
      };
      reader.readAsDataURL(file);
    },
    [accept, maxSizeMB, onFileSelect, onError]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [disabled, processFile]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [disabled]
  );

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClear?.();
  }, [onClear]);

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white' : 'text-gray-700'}`}>
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-describedby={error ? 'file-error' : hint ? 'file-hint' : undefined}
      />

      {currentFile ? (
        <div
          className={`
            flex items-center justify-between p-4 rounded-lg border
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 bg-[#BBDCEF] rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#16314C]"
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
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(currentFile.size)}
              </p>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
              aria-label="Remove file"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label={`Upload ${accept} file. Press Enter or Space to open file browser, or drag and drop.`}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors focus-ring
            ${disabled
              ? isDark
                ? 'border-white/10 bg-white/5 cursor-not-allowed'
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : isDragging
                ? isDark
                  ? 'border-[var(--color-brave-500)] bg-[var(--color-brave-500)]/20'
                  : 'border-[#16314C] bg-[#BBDCEF]/20'
                : error
                  ? 'border-red-300 hover:border-red-400 bg-red-50/50'
                  : isDark
                    ? 'border-white/20 hover:border-[var(--color-brave-500)] bg-[#1a2744] hover:bg-[#1a2744]/80'
                    : 'border-gray-300 hover:border-[#16314C] hover:bg-gray-50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${disabled
                  ? isDark ? 'bg-white/10' : 'bg-gray-100'
                  : isDark ? 'bg-[var(--color-brave-500)]/20' : 'bg-[#BBDCEF]/50'
                }
              `}
            >
              <svg
                className={`w-6 h-6 ${
                  disabled
                    ? isDark ? 'text-gray-500' : 'text-gray-400'
                    : isDark ? 'text-[var(--color-brave-400)]' : 'text-[#16314C]'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className={isDark ? 'text-[var(--color-brave-400)]' : 'text-[#16314C]'}>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {accept.replace(/\./g, '').toUpperCase()} up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p id="file-error" role="alert" className={`mt-1.5 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id="file-hint" className={`mt-1.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

export { FileUpload };
export type { FileUploadProps };
