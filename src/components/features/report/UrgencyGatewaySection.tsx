'use client';

import { Collapsible, Card, Badge } from '@/components/ui';
import { UrgencyGateway } from '@/lib/types';

interface UrgencyGatewaySectionProps {
  urgencyGateway?: UrgencyGateway;
  defaultOpen?: boolean;
}

function UrgencyGatewaySection({ urgencyGateway, defaultOpen = true }: UrgencyGatewaySectionProps) {
  if (!urgencyGateway) {
    return null;
  }

  return (
    <Collapsible
      title="Urgency Gateway"
      badge="The Aspirin"
      defaultOpen={defaultOpen}
    >
      <div className="space-y-4">
        {/* Header explanation */}
        <p className="text-sm text-gray-600">
          This is the #1 most pressing problem your audience needs solved RIGHT NOW.
          Build your entry offer around this &quot;aspirin&quot; to attract clients quickly.
        </p>

        {/* Main Gateway Card */}
        <Card padding="md" className="bg-gradient-to-br from-[#16314C]/5 to-[#BBDCEF]/20 border-[#16314C]/20">
          <div className="space-y-4">
            {/* The Problem */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="error">Gateway Problem</Badge>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {urgencyGateway.problem}
              </p>
            </div>

            {/* Why It's Urgent */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Why It&apos;s Urgent</h4>
              <p className="text-gray-700">
                {urgencyGateway.whyUrgent}
              </p>
            </div>

            {/* Emotional State */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">How They Feel</h4>
              <p className="text-gray-700 italic">
                &quot;{urgencyGateway.emotionalState}&quot;
              </p>
            </div>

            {/* The Aspirin */}
            <div className="pt-4 border-t border-[#16314C]/10">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">The Aspirin</Badge>
              </div>
              <p className="text-gray-900 font-medium">
                {urgencyGateway.aspirinSolution}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This quick win builds trust and opens the door to your value ladder.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Collapsible>
  );
}

export { UrgencyGatewaySection };
export type { UrgencyGatewaySectionProps };
