import React from 'react';
import { ShieldCheck, ShieldAlert, FileCheck2 } from 'lucide-react';

/**
 * Four high-level summary cards: Overall Score, Verification Status,
 * Risk Level, Documents Passed. All values come from the normalized
 * profile — a card is skipped (not rendered with fake data) if its
 * underlying data is missing.
 *
 * Layout: 4-across on desktop, 2x2 on tablet, 1-column on mobile.
 */
const RING_SIZE = 88;
const RING_STROKE = 8;

const ScoreRing = ({ percent = 0, colorClass = 'text-banking-success' }) => {
  const radius = (RING_SIZE - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          strokeWidth={RING_STROKE}
          className="stroke-border-light fill-none"
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          strokeWidth={RING_STROKE}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`fill-none transition-all duration-700 ${colorClass}`}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-text-primary">{clamped}%</span>
      </div>
    </div>
  );
};

const StatCardShell = ({ title, children, footer }) => (
  <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6 flex flex-col items-center text-center">
    <h3 className="text-xs sm:text-sm font-medium text-text-secondary mb-4">{title}</h3>
    {children}
    <p className="text-xs sm:text-sm text-text-muted mt-3">{footer}</p>
  </div>
);

const riskColor = {
  LOW: 'text-banking-success bg-green-50 border-green-200',
  MEDIUM: 'text-banking-warning bg-yellow-50 border-yellow-200',
  HIGH: 'text-banking-error bg-red-50 border-red-200',
  CRITICAL: 'text-red-800 bg-red-100 border-red-300',
};

export const OverallScoreCard = ({ score }) => {
  if (score === null || score === undefined) return null;
  const label = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Review';
  return (
    <StatCardShell title="Overall Score" footer={label}>
      <ScoreRing percent={score} />
    </StatCardShell>
  );
};

export const VerificationStatusCard = ({ status }) => {
  if (!status) return null;
  const isVerified = status.toUpperCase() === 'VERIFIED';
  return (
    <StatCardShell title="Verification Status" footer={isVerified ? 'All details verified' : 'Review required'}>
      <div className={`w-[88px] h-[88px] rounded-full flex items-center justify-center border-4 ${isVerified ? 'border-green-100 bg-green-50' : 'border-yellow-100 bg-yellow-50'}`}>
        <ShieldCheck size={32} className={isVerified ? 'text-banking-success' : 'text-banking-warning'} />
      </div>
      <p className={`text-sm font-bold mt-3 ${isVerified ? 'text-banking-success' : 'text-banking-warning'}`}>
        {status.toUpperCase()}
      </p>
    </StatCardShell>
  );
};

export const RiskLevelCard = ({ level }) => {
  if (!level) return null;
  const cls = riskColor[level.toUpperCase()] || riskColor.MEDIUM;
  const isLow = level.toUpperCase() === 'LOW';
  return (
    <StatCardShell title="Risk Level" footer={`${isLow ? 'Low' : level} Risk Profile`}>
      <div className={`w-[88px] h-[88px] rounded-full flex items-center justify-center border-4 ${cls}`}>
        <ShieldAlert size={32} />
      </div>
      <p className={`text-sm font-bold mt-3 px-2 py-0.5 rounded border ${cls}`}>{level.toUpperCase()}</p>
    </StatCardShell>
  );
};

export const DocumentsPassedCard = ({ passed, total }) => {
  if (passed === null || passed === undefined || total === null || total === undefined) return null;
  const allPassed = total > 0 && passed === total;
  return (
    <StatCardShell title="Documents Passed" footer={allPassed ? 'All Documents Passed' : 'Some documents need review'}>
      <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center bg-banking-softBlue border-4 border-blue-100">
        <FileCheck2 size={32} className="text-banking-primary" />
      </div>
      <p className="text-lg font-bold text-text-primary mt-3">{passed} / {total}</p>
    </StatCardShell>
  );
};

const ProfileStats = ({ verification, risk, documents }) => {
  const cards = [
    verification?.overallScore !== null && verification?.overallScore !== undefined && (
      <OverallScoreCard key="score" score={verification.overallScore} />
    ),
    verification?.status && <VerificationStatusCard key="status" status={verification.status} />,
    risk?.level && <RiskLevelCard key="risk" level={risk.level} />,
    documents && <DocumentsPassedCard key="docs" passed={documents.passed} total={documents.total} />,
  ].filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards}
    </div>
  );
};

export default ProfileStats;
