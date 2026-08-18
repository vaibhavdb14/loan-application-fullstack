import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  warning: { icon: AlertTriangle, cls: 'text-banking-warning bg-yellow-50 border-yellow-200' },
  error: { icon: XCircle, cls: 'text-banking-error bg-red-50 border-red-200' },
  info: { icon: Info, cls: 'text-banking-info bg-cyan-50 border-cyan-200' },
};

/**
 * Summarizes verification checks reported by the API. Renders exactly
 * what the API found — passed checks AND discrepancies are both shown
 * faithfully; nothing is hidden to make the UI look more positive than
 * the underlying data.
 */
const AIVerificationSummary = ({ checks = [], discrepancies = [] }) => {
  if (checks.length === 0 && discrepancies.length === 0) return null;

  const hasDiscrepancies = discrepancies.length > 0;

  return (
    <div className="bg-banking-card border border-banking-info/30 rounded-lg shadow-sm p-4 sm:p-6 h-full">
      <h3 className="text-sm sm:text-base font-semibold text-banking-info mb-4 flex items-center gap-2">
        <Sparkles size={18} />
        AI Verification Summary
      </h3>

      {checks.length > 0 && (
        <ul className="space-y-2.5 mb-4">
          {checks.map((check) => (
            <li key={check.key || check.label} className="flex items-start gap-2 text-sm">
              {check.passed ? (
                <CheckCircle2 size={16} className="text-banking-success shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={16} className="text-banking-warning shrink-0 mt-0.5" />
              )}
              <span className={check.passed ? 'text-text-primary' : 'text-banking-warning font-medium'}>
                {check.label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {hasDiscrepancies ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-banking-error">
            {discrepancies.length} discrepanc{discrepancies.length === 1 ? 'y' : 'ies'} require{discrepancies.length === 1 ? 's' : ''} attention
          </p>
          {discrepancies.map((d, i) => {
            const config = SEVERITY_CONFIG[d.severity] || SEVERITY_CONFIG.warning;
            const Icon = config.icon;
            return (
              <div key={i} className={`border rounded-md p-3 text-xs sm:text-sm ${config.cls}`}>
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <Icon size={14} className="shrink-0" />
                  {d.field || 'Field mismatch'}
                </p>
                {d.source && <p className="text-text-secondary">Source: {d.source}</p>}
                {(d.expectedValue || d.extractedValue) && (
                  <p className="text-text-secondary mt-1">
                    Expected: <span className="font-medium">{d.expectedValue ?? '—'}</span>
                    {' · '}
                    Found: <span className="font-medium">{d.extractedValue ?? '—'}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        checks.length > 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2.5 text-sm text-banking-success font-medium">
            <CheckCircle2 size={16} className="shrink-0" />
            No discrepancies found
          </div>
        )
      )}
    </div>
  );
};

export default AIVerificationSummary;
