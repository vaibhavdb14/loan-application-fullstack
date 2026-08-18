import React from 'react';
import { ShieldAlert } from 'lucide-react';

const LEVEL_STYLES = {
  LOW: 'bg-green-50 text-banking-success border-green-200',
  MEDIUM: 'bg-yellow-50 text-banking-warning border-yellow-200',
  HIGH: 'bg-red-50 text-banking-error border-red-200',
  CRITICAL: 'bg-red-100 text-red-800 border-red-300',
};

const INDICATOR_DOT = {
  GREEN: 'bg-banking-success',
  AMBER: 'bg-banking-warning',
  ORANGE: 'bg-banking-warning',
  RED: 'bg-banking-error',
};

const Row = ({ label, children }) => (
  <div className="flex items-center justify-between py-2 border-b border-border-light last:border-b-0">
    <span className="text-xs sm:text-sm text-text-secondary">{label}</span>
    <span className="text-sm font-medium text-text-primary">{children}</span>
  </div>
);

/**
 * Risk assessment card. Level/indicator/flags are all API-driven —
 * text + icon are always shown alongside color so status is never
 * communicated by color alone.
 */
const RiskAssessment = ({ level, indicator, manualReviewRequired, riskFlags, riskScore }) => {
  if (!level) return null;
  const upper = level.toUpperCase();
  const styles = LEVEL_STYLES[upper] || LEVEL_STYLES.MEDIUM;

  return (
    <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6 h-full">
      <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
        <ShieldAlert size={18} className="text-banking-warning" />
        Risk Assessment
      </h3>

      <div className="flex flex-col items-center text-center mb-4">
        <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${styles}`}>
          <span className="text-sm font-bold leading-tight">{upper}</span>
          <span className="text-[10px] font-medium leading-tight">RISK</span>
        </div>
      </div>

      <dl>
        {indicator && (
          <Row label="Risk Indicator">
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${INDICATOR_DOT[indicator.toUpperCase()] || 'bg-text-muted'}`} />
              {indicator.toUpperCase()}
            </span>
          </Row>
        )}
        <Row label="Manual Review Required">
          {manualReviewRequired ? (
            <span className="text-banking-warning">YES</span>
          ) : (
            <span className="text-banking-success">NO</span>
          )}
        </Row>
        <Row label="Risk Flags">{riskFlags ?? 0}</Row>
        {riskScore !== null && riskScore !== undefined && <Row label="Risk Score">{riskScore}</Row>}
      </dl>
    </div>
  );
};

export default RiskAssessment;
