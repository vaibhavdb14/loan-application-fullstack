import React from 'react';

/**
 * Generic card used by every "section" of the Digital Profile
 * (Applicant, Employment, Income, Banking, Tax, Loan).
 *
 * rows: [{ label, value }] — only rows with a non-null value are shown
 * unless showEmptyAsUnavailable is true, in which case missing values
 * render as "Not available" instead of being hidden. Long labels/values
 * wrap instead of overflowing on mobile.
 */
const InfoCard = ({ icon: Icon, title, badge, rows = [], showEmptyAsUnavailable = true }) => {
  const visibleRows = showEmptyAsUnavailable
    ? rows
    : rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== '');

  if (visibleRows.length === 0) return null;

  return (
    <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm sm:text-base font-semibold text-text-primary flex items-center gap-2">
          {Icon && <Icon size={18} className="text-banking-primary shrink-0" />}
          {title}
        </h3>
        {badge}
      </div>

      <dl className="space-y-3 sm:space-y-3.5">
        {visibleRows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2"
          >
            <dt className="text-xs sm:text-sm text-text-secondary shrink-0">{row.label}</dt>
            <dd className="text-sm font-medium text-text-primary text-left sm:text-right break-words">
              {row.value ?? <span className="text-text-muted font-normal">Not available</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default InfoCard;
