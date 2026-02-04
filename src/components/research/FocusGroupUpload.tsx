'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUpload } from '@/components/ui/FileUpload'
import { FocusGroupInsights } from '@/lib/research/schemas'

interface FocusGroupUploadProps {
  onInsightsReady: (insights: FocusGroupInsights) => void
  onSkip: () => void
  disabled?: boolean
}

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'review' | 'error'

export function FocusGroupUpload({ onInsightsReady, onSkip, disabled }: FocusGroupUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<{ name: string; size: number } | null>(null)
  const [insights, setInsights] = useState<FocusGroupInsights | null>(null)

  const handleFileSelect = useCallback(async (file: File, base64: string) => {
    setCurrentFile({ name: file.name, size: file.size })
    setStatus('processing')
    setError(null)

    try {
      const response = await fetch('/api/process-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileContent: base64 }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process transcription')
      }

      setInsights(data.insights)
      setStatus('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }, [])

  const handleConfirm = () => {
    if (insights) {
      onInsightsReady(insights)
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setStatus('idle')
    setCurrentFile(null)
    setInsights(null)
    setError(null)
  }

  const handleSkip = () => {
    setIsOpen(false)
    onSkip()
  }

  const handleError = (message: string) => {
    setError(message)
    setStatus('error')
  }

  const handleClear = () => {
    setCurrentFile(null)
    setStatus('idle')
    setError(null)
    setInsights(null)
  }

  return (
    <>
      {/* Trigger Button */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-[#141414] rounded-xl p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>✨</span> Supercharge Your Research
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Upload focus group transcriptions for deeper, validated insights
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                disabled={disabled}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Skip
              </button>
              <button
                onClick={() => setIsOpen(true)}
                disabled={disabled}
                className="px-6 py-2 bg-[var(--color-brave-600)]/20 hover:bg-[var(--color-brave-600)]/30 text-[var(--color-brave-500)] border border-[var(--color-brave-500)]/50 font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Add Focus Group Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Add Focus Group Data</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Upload transcriptions from customer conversations
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {status === 'idle' && (
                  <div className="space-y-6">
                    <div className="bg-[#141414] rounded-xl p-4 border border-white/10">
                      <h4 className="font-medium text-white mb-2">Supported formats</h4>
                      <p className="text-gray-400 text-sm">
                        Text files (.txt) or JSON exports from transcription services
                      </p>
                    </div>
                    <FileUpload
                      accept=".txt,.json"
                      maxSizeMB={25}
                      onFileSelect={handleFileSelect}
                      onError={handleError}
                      onClear={handleClear}
                      currentFile={currentFile}
                      label="Upload Transcription"
                      hint="Drag and drop your focus group transcription file"
                    />
                  </div>
                )}

                {status === 'processing' && (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="inline-block text-5xl mb-4"
                    >
                      🔬
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Processing Transcription
                    </h3>
                    <p className="text-gray-400">
                      Extracting insights from your focus group data...
                    </p>
                    <div className="mt-6 space-y-2 max-w-sm mx-auto">
                      {['Finding direct quotes', 'Identifying pain points', 'Mapping vocabulary patterns'].map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.5 }}
                          className="flex items-center gap-3 text-left"
                        >
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="text-[var(--color-brave-500)]"
                          >
                            ●
                          </motion.span>
                          <span className="text-gray-300">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-red-400 mb-2">Processing Failed</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                      onClick={handleClear}
                      className="px-6 py-2 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {status === 'review' && insights && (
                  <div className="space-y-6">
                    <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Insights Extracted Successfully</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Review the insights below. These will be used to enhance your audience research.
                      </p>
                    </div>

                    {/* Direct Quotes */}
                    {insights.directQuotes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <span>💬</span> Direct Quotes ({insights.directQuotes.length})
                        </h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {insights.directQuotes.slice(0, 5).map((q, i) => (
                            <div key={i} className="bg-[#141414] p-3 rounded-lg border border-white/10">
                              <p className="text-white italic">"{q.quote}"</p>
                              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                <span>{q.context}</span>
                                <span className="text-[var(--color-brave-500)]">{q.emotion}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pain Points */}
                    {insights.painPoints.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <span>💢</span> Pain Points ({insights.painPoints.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {insights.painPoints.map((p, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1 rounded-full text-sm ${
                                p.frequency === 'dominant_theme'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : p.frequency === 'recurring'
                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                              }`}
                            >
                              {p.pain}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vocabulary Patterns */}
                    {insights.vocabularyPatterns.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <span>🗣️</span> Their Vocabulary
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {insights.vocabularyPatterns.map((phrase, i) => (
                            <span
                              key={i}
                              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                            >
                              {phrase}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {status === 'review' && (
                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Upload Different File
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-6 py-2 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors"
                  >
                    Use These Insights
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
