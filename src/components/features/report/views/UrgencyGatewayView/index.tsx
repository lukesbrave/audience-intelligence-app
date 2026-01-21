'use client';

import { Card, Badge } from '@/components/ui';
import { UrgencyGateway, PainPoint } from '@/lib/types';

interface UrgencyGatewayViewProps {
  urgencyGateway?: UrgencyGateway;
  painPoints?: PainPoint[];
}

function UrgencyGatewayView({ urgencyGateway, painPoints = [] }: UrgencyGatewayViewProps) {
  // Find the gateway pain point
  const gatewayPainPoint = painPoints.find(p => p.classification === 'URGENCY_GATEWAY');
  const rootCausePainPoints = painPoints.filter(p => p.classification === 'ROOT_CAUSE');
  const secondaryPainPoints = painPoints.filter(p => p.classification === 'SECONDARY');

  if (!urgencyGateway) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Urgency Gateway Not Available</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          The urgency gateway analysis will be available after running research with the updated workflow.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Urgency Gateway</h1>
        <p className="text-sm text-gray-500 mt-1">
          The #1 most pressing problem your audience needs solved RIGHT NOW
        </p>
      </div>

      {/* Main Gateway Card */}
      <Card padding="lg" className="bg-gradient-to-br from-[#16314C]/5 to-[#BBDCEF]/20 border-[#16314C]/20">
        <div className="space-y-6">
          {/* The Problem */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="error">Gateway Problem</Badge>
              <span className="text-xs text-gray-500">This is their &quot;aspirin&quot; moment</span>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {urgencyGateway.problem}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Why It's Urgent */}
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-[#16314C] mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Why It&apos;s Urgent
              </h4>
              <p className="text-gray-700">{urgencyGateway.whyUrgent}</p>
            </div>

            {/* Emotional State */}
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-[#16314C] mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                How They Feel
              </h4>
              <p className="text-gray-700 italic">&quot;{urgencyGateway.emotionalState}&quot;</p>
            </div>
          </div>

          {/* The Aspirin */}
          <div className="pt-4 border-t border-[#16314C]/10">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="success">The Aspirin</Badge>
              <span className="text-xs text-gray-500">Your quick-win solution</span>
            </div>
            <p className="text-lg text-gray-900 font-medium">{urgencyGateway.aspirinSolution}</p>
          </div>
        </div>
      </Card>

      {/* Framework Explanation */}
      <Card padding="md" className="bg-amber-50/50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Why This Matters</h4>
            <p className="text-sm text-amber-700">
              Your Urgency Gateway is your entry point for new clients. By solving this ONE pressing problem quickly,
              you build trust and open the door to your value ladder. Remember: trying to solve all problems at once
              triggers the Paradox of Choice — one clear offer, one pressing problem, one quick win.
            </p>
          </div>
        </div>
      </Card>

      {/* Pain Point Classification */}
      {painPoints.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Pain Point Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gateway */}
            <Card padding="sm" className="border-red-200 bg-red-50/30">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="error">Urgency Gateway</Badge>
              </div>
              <p className="text-xs text-gray-500 mb-2">Solve this FIRST</p>
              {gatewayPainPoint ? (
                <p className="text-sm text-gray-700 font-medium">{gatewayPainPoint.pain}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">Not identified</p>
              )}
            </Card>

            {/* Root Cause */}
            <Card padding="sm" className="border-orange-200 bg-orange-50/30">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="warning">Root Cause</Badge>
              </div>
              <p className="text-xs text-gray-500 mb-2">Solve AFTER gateway</p>
              {rootCausePainPoints.length > 0 ? (
                <ul className="space-y-1">
                  {rootCausePainPoints.map((p, i) => (
                    <li key={i} className="text-sm text-gray-700">{p.pain}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">None identified</p>
              )}
            </Card>

            {/* Secondary */}
            <Card padding="sm" className="border-gray-200 bg-gray-50/30">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default">Secondary</Badge>
              </div>
              <p className="text-xs text-gray-500 mb-2">Address over time</p>
              {secondaryPainPoints.length > 0 ? (
                <ul className="space-y-1">
                  {secondaryPainPoints.map((p, i) => (
                    <li key={i} className="text-sm text-gray-700">{p.pain}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">None identified</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export { UrgencyGatewayView };
export type { UrgencyGatewayViewProps };
