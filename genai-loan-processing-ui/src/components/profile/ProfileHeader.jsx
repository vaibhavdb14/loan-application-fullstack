import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';

/**
 * Page-level header: "Digital Profile" title + verified badge (left),
 * optional Download Report action (right). Verified state comes from
 * the API — never assumed true by default.
 */
const ProfileHeader = ({ verified, onDownloadReport }) => (
  <div className="flex items-center justify-between gap-3 flex-wrap">
    <div className="flex items-center gap-3">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Digital Profile</h1>
      {verified && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-banking-success border border-green-200">
          <CheckCircle2 size={14} />
          VERIFIED
        </span>
      )}
    </div>

    {onDownloadReport && (
      <button
        onClick={onDownloadReport}
        className="flex items-center gap-2 px-4 py-2.5 sm:py-2 border border-border rounded-md text-sm font-medium text-text-primary bg-white hover:bg-gray-50 transition-colors shrink-0 min-h-[42px]"
      >
        <Download size={16} />
        <span className="hidden xs:inline sm:inline">Download Report</span>
      </button>
    )}
  </div>
);

export default ProfileHeader;
