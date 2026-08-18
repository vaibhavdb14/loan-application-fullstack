import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Small pill badge used on section cards (Employment, Banking, Tax)
 * to indicate the API reported that section as verified.
 * Only rendered when the API actually confirms verification —
 * never shown speculatively.
 */
const VerifiedPill = ({ label = 'VERIFIED' }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-green-50 text-banking-success border border-green-200 shrink-0">
    <CheckCircle2 size={12} />
    {label}
  </span>
);

export default VerifiedPill;
