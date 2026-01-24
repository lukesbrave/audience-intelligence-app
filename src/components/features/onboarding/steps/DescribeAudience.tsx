'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FileUpload } from '@/components/ui/FileUpload'
import { FocusGroupInsights } from '@/lib/research/schemas'

interface DescribeAudienceProps {
  businessDescription: string
  idealClientDescription: string
  focusGroupInsights: FocusGroupInsights | null
  onUpdate: (updates: {
    businessDescription?: string
    idealClientDescription?: string
    focusGroupInsights?: FocusGroupInsights | null
  }) => void
  onBack: () => void
  onNext: () => void
}

type Tab = 'manual' | 'upload'
type UploadStatus = 'idle' | 'processing' | 'review' | 'error'

export default function DescribeAudience({
  businessDescription,
  idealClientDescription,
  focusGroupInsights,
  onUpdate,
  onBack,
  onNext
}: DescribeAudienceProps) {
  const [activeTab, setActiveTab] = useState<Tab>(focusGroupInsights ? 'upload' : 'manual')
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(focusGroupInsights ? 'review' : 'idle')
  const [error, setError] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<{ name: string; size: number } | null>(null)
  const [localInsights, setLocalInsights] = useState<FocusGroupInsights | null>(focusGroupInsights)
  const [uploadBusinessContext, setUploadBusinessContext] = useState('')

  // Validation for manual tab
  const isManualValid = businessDescription.length >= 20 && idealClientDescription.length >= 20

  // Validation for upload tab
  const isUploadValid = localInsights !== null && uploadStatus === 'review'

  const handleFileSelect = useCallback(async (file: File, base64: string) => {
    setCurrentFile({ name: file.name, size: file.size })
    setUploadStatus('processing')
    setError(null)

    try {
      const response = await fetch('/api/process-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContent: base64,
          businessContext: uploadBusinessContext || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process transcription')
      }

      setLocalInsights(data.insights)
      setUploadStatus('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setUploadStatus('error')
    }
  }, [uploadBusinessContext])

  const handleClear = () => {
    setCurrentFile(null)
    setUploadStatus('idle')
    setError(null)
    setLocalInsights(null)
    onUpdate({ focusGroupInsights: null })
  }

  const handleError = (message: string) => {
    setError(message)
    setUploadStatus('error')
  }

  const handleNext = () => {
    if (activeTab === 'upload' && localInsights) {
      // When using focus group data, generate descriptions from insights
      const generatedBusiness = `Business helping people with: ${localInsights.painPoints.slice(0, 3).map(p => p.pain).join(', ')}`
      const generatedClient = localInsights.directQuotes.length > 0
        ? `People who say things like: "${localInsights.directQuotes[0].quote}" - experiencing ${localInsights.painPoints[0]?.pain || 'various challenges'}`
        : `Target audience identified through focus group research with ${localInsights.painPoints.length} pain points and ${localInsights.vocabularyPatterns.length} vocabulary patterns identified.`

      onUpdate({
        businessDescription: generatedBusiness,
        idealClientDescription: generatedClient,
        focusGroupInsights: localInsights,
      })
    } else {
      // Manual path - clear any focus group data
      onUpdate({ focusGroupInsights: null })
    }
    onNext()
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    // Reset upload state when switching to upload tab
    if (tab === 'upload' && !localInsights) {
      setUploadStatus('idle')
      setCurrentFile(null)
      setError(null)
    }
  }

  return (
    <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
      <h1 className="text-2xl font-bold text-white mb-2">
        Tell us about your business and who you serve
      </h1>
      <p className="text-gray-400 mb-6">
        The more detail you share, the sharper your research will be.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-[#1a2744] rounded-lg">
        <button
          onClick={() => handleTabChange('manual')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'manual'
              ? 'bg-[#243351] text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Describe Manually
        </button>
        <button
          onClick={() => handleTabChange('upload')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-[#243351] text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>✨</span> Upload Focus Group Data
        </button>
      </div>

      {/* Manual Tab Content */}
      {activeTab === 'manual' && (
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              What do you do?
            </label>
            <textarea
              value={businessDescription}
              onChange={(e) => onUpdate({ businessDescription: e.target.value })}
              placeholder="I help [who] achieve [what] through [how]..."
              className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brave-500)] focus:ring-1 focus:ring-[var(--color-brave-500)] resize-none"
              rows={4}
            />
            <p className="text-gray-500 text-sm mt-1">
              Describe your business, service, or expertise in a few sentences.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Who is your ideal client?
            </label>
            <textarea
              value={idealClientDescription}
              onChange={(e) => onUpdate({ idealClientDescription: e.target.value })}
              placeholder="They're typically [role/situation] who struggle with [problem] and want [outcome]..."
              className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brave-500)] focus:ring-1 focus:ring-[var(--color-brave-500)] resize-none"
              rows={6}
            />
            <p className="text-gray-500 text-sm mt-1">
              Describe them like you&apos;re telling a friend - their situation, struggles, and what they&apos;re hoping for.
            </p>
          </div>
        </div>
      )}

      {/* Upload Tab Content */}
      {activeTab === 'upload' && (
        <div className="mb-8">
          {uploadStatus === 'idle' && (
            <div className="space-y-6">
              <div className="bg-[var(--color-brave-600)]/10 rounded-xl p-4 border border-[var(--color-brave-500)]/30">
                <h4 className="font-medium text-[var(--color-brave-400)] mb-2 flex items-center gap-2">
                  <span>🎯</span> Skip the typing - let your customers speak for you
                </h4>
                <p className="text-gray-400 text-sm">
                  Upload your focus group transcriptions and we&apos;ll extract exactly who your audience is, what they struggle with, and how they talk about it.
                </p>
              </div>

              {/* Optional business context */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Briefly, what do you do? <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={uploadBusinessContext}
                  onChange={(e) => setUploadBusinessContext(e.target.value)}
                  placeholder="e.g., I help entrepreneurs scale their coaching business"
                  className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brave-500)] focus:ring-1 focus:ring-[var(--color-brave-500)]"
                />
                <p className="text-gray-500 text-sm mt-1">
                  This helps us better understand your transcriptions
                </p>
              </div>

              <FileUpload
                accept=".txt,.pdf,.json"
                maxSizeMB={25}
                variant="dark"
                onFileSelect={handleFileSelect}
                onError={handleError}
                onClear={handleClear}
                currentFile={currentFile}
                label="Upload Transcription"
                hint="Drag and drop your focus group transcription file"
              />
            </div>
          )}

          {uploadStatus === 'processing' && (
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

          {uploadStatus === 'error' && (
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

          {uploadStatus === 'review' && localInsights && (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Insights Extracted Successfully</span>
                </div>
                <p className="text-gray-300 text-sm">
                  We found {localInsights.directQuotes.length} quotes, {localInsights.painPoints.length} pain points, and {localInsights.vocabularyPatterns.length} vocabulary patterns. This will supercharge your research!
                </p>
              </div>

              {/* Direct Quotes */}
              {localInsights.directQuotes.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span>💬</span> Direct Quotes ({localInsights.directQuotes.length})
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {localInsights.directQuotes.slice(0, 3).map((q, i) => (
                      <div key={i} className="bg-[#1a2744] p-3 rounded-lg border border-white/10">
                        <p className="text-white italic">&ldquo;{q.quote}&rdquo;</p>
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
              {localInsights.painPoints.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span>💢</span> Pain Points ({localInsights.painPoints.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {localInsights.painPoints.map((p, i) => (
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
              {localInsights.vocabularyPatterns.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span>🗣️</span> Their Vocabulary
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {localInsights.vocabularyPatterns.slice(0, 10).map((phrase, i) => (
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

              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Upload a different file
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          &#8592; Back
        </button>

        <button
          onClick={handleNext}
          disabled={activeTab === 'manual' ? !isManualValid : !isUploadValid}
          className="px-8 py-3 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review &amp; Continue
        </button>
      </div>
    </div>
  )
}
