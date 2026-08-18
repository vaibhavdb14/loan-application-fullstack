import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

/**
 * Top success banner. All copy is API-driven: applicant name and
 * status come from the normalized profile, never hard-coded.
 * Stacks vertically on small screens.
 */
const VerificationBanner = ({ applicantName, statusLabel }) => (
  <div className="bg-banking-card border border-green-200 rounded-lg shadow-sm p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-banking-success rounded-full flex items-center justify-center shrink-0">
          <Check size={26} className="text-white" strokeWidth={3} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-text-primary truncate">
            Hello {applicantName || 'there'}!
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Your digital financial profile has been created successfully and all details are verified.
          </p>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1 border-t sm:border-t-0 sm:border-l border-border-light pt-4 sm:pt-0 sm:pl-6 shrink-0">
        <div className="text-left sm:text-right">
          <p className="text-xs text-text-secondary uppercase tracking-wide">Status</p>
          <p className="text-sm sm:text-base font-bold text-banking-success leading-tight">
            {statusLabel || 'READY FOR ELIGIBILITY CHECK'}
          </p>
        </div>
        <ShieldCheck size={28} className="text-banking-success/70 shrink-0 hidden sm:block" />
      </div>
    </div>
  </div>
);

export default VerificationBanner;
