import React from 'react';
import { FileStack, FileCog, FileCheck2, FileClock, FileX2 } from 'lucide-react';
import { calculateSuccessRate } from '../../utils/formatters';

const Metric = ({ icon: Icon, iconCls, label, value }) => (
  <div className="flex items-center gap-2.5">
    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${iconCls}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[11px] text-text-secondary leading-tight">{label}</p>
      <p className="text-base font-bold text-text-primary leading-tight">{value}</p>
    </div>
  </div>
);

/**
 * Document processing metrics card. Success rate is calculated on the
 * frontend from passed/total if the API doesn't provide it directly,
 * guarded against division by zero.
 */
const DocumentProcessingSummary = ({ total, processed, passed, reviewRequired, failed }) => {
  if (total === null || total === undefined) return null;
  const successRate = calculateSuccessRate(passed, total);

  return (
    <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-5 flex items-center gap-2">
        <FileStack size={18} className="text-banking-primary" />
        Document Processing Summary
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-3 flex-1">
          <Metric icon={FileStack} iconCls="bg-banking-softBlue text-banking-primary" label="Total Documents" value={total} />
          <Metric icon={FileCog} iconCls="bg-blue-50 text-banking-primary" label="Processed" value={processed ?? 0} />
          <Metric icon={FileCheck2} iconCls="bg-green-50 text-banking-success" label="Passed" value={passed ?? 0} />
          <Metric icon={FileClock} iconCls="bg-yellow-50 text-banking-warning" label="Review Required" value={reviewRequired ?? 0} />
          <Metric icon={FileX2} iconCls="bg-red-50 text-banking-error" label="Failed" value={failed ?? 0} />
        </div>

        <div className="flex sm:flex-col items-center gap-3 sm:gap-1 self-center sm:self-auto shrink-0 sm:pl-4 sm:border-l border-border-light pt-4 sm:pt-0 border-t sm:border-t-0 border-border-light">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" strokeWidth="3" className="stroke-border-light fill-none" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 15.5}
                strokeDashoffset={2 * Math.PI * 15.5 * (1 - successRate / 100)}
                strokeLinecap="round"
                className="stroke-banking-success fill-none transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">
              {successRate}%
            </div>
          </div>
          <span className="text-xs text-text-secondary whitespace-nowrap">Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentProcessingSummary;
