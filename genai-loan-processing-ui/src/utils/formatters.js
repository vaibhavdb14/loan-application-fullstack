/**
 * Shared formatting utilities used across the Digital Profile
 * (and any other financial data displays).
 */

/**
 * Formats a numeric value as Indian Rupees, e.g. 68000 -> "₹68,000".
 * Returns a safe fallback for null/undefined/non-numeric input instead
 * of ever rendering "undefined" or "NaN" in the UI.
 */
export const formatCurrency = (value, fallback = 'Not available') => {
  if (value === null || value === undefined || value === '') return fallback;
  const num = Number(value);
  if (Number.isNaN(num)) return fallback;
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Generic "show value or a safe fallback" helper, used for any
 * non-currency field that might be missing from the API response.
 */
export const displayOrFallback = (value, fallback = 'Not available') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

/**
 * Masks sensitive identifiers, keeping only the last N characters visible.
 * e.g. maskValue('1234567890', 4) -> "XXXXXX7890"
 * Safe against short/undefined input.
 */
export const maskValue = (value, visibleChars = 4) => {
  if (!value) return null;
  const str = String(value).replace(/\s+/g, '');
  if (str.length <= visibleChars) return str;
  const visible = str.slice(-visibleChars);
  return `${'X'.repeat(str.length - visibleChars)}${visible}`;
};

/**
 * Calculates a success rate percentage from passed/total counts,
 * guarding against division by zero.
 */
export const calculateSuccessRate = (passed, total) => {
  if (!total || total <= 0) return 0;
  return Math.round((passed / total) * 100);
};
