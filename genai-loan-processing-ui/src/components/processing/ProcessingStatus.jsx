import React from 'react';
import { CheckCircle2, Loader2, Circle, AlertCircle } from 'lucide-react';

/**
 * Reusable step-by-step process indicator.
 * steps: [{ key, label, status: 'idle' | 'active' | 'complete' | 'failed' }]
 * orientation: 'vertical' | 'horizontal'
 */
const ProcessingStatus = ({ steps, orientation = 'vertical' }) => {
  if (orientation === 'horizontal') {
    return (
      <div className="flex items-center w-full overflow-x-auto no-scrollbar pb-1">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center shrink-0 px-1">
              <StepIcon status={s.status} />
              <span
                className={`text-[11px] mt-1.5 font-medium text-center leading-tight max-w-[72px] ${
                  s.status === 'idle' ? 'text-text-muted' : 'text-text-primary'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 min-w-[16px] mx-1 mt-[-14px] ${
                  s.status === 'complete' ? 'bg-banking-success' : 'bg-border-light'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {steps.map((s) => (
        <div key={s.key} className="flex items-center gap-3">
          <StepIcon status={s.status} />
          <div className="min-w-0">
            <span
              className={`text-sm font-medium block truncate ${
                s.status === 'complete'
                  ? 'text-text-primary'
                  : s.status === 'active'
                  ? 'text-banking-primary'
                  : s.status === 'failed'
                  ? 'text-banking-error'
                  : 'text-text-muted'
              }`}
            >
              {s.label}
            </span>
            {s.detail && <span className="text-xs text-text-muted">{s.detail}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

const StepIcon = ({ status }) => {
  if (status === 'complete') return <CheckCircle2 size={20} className="text-banking-success shrink-0 animate-check-pop" />;
  if (status === 'active') return <Loader2 size={20} className="text-banking-primary shrink-0 animate-spin" />;
  if (status === 'failed') return <AlertCircle size={20} className="text-banking-error shrink-0" />;
  return <Circle size={20} className="text-border shrink-0" />;
};

export default ProcessingStatus;
