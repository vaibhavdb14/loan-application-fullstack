import React, { useEffect, useState } from 'react';
import { ShieldCheck, X, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * Reusable confirmation modal for sensitive actions (Approve/Decline/Revoke).
 * Desktop: centered dialog. Mobile: near-full-width, bottom-anchored sheet.
 */
const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  tone = 'primary', // 'primary' | 'success' | 'error'
  requireCode = true,
  onCancel,
  onConfirm,
}) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle | processing | success

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setStatus('idle');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && status === 'idle') onCancel?.();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, status, onCancel]);

  if (!isOpen) return null;

  const toneCls = {
    primary: 'bg-banking-primary hover:bg-blue-700',
    success: 'bg-banking-success hover:bg-green-700',
    error: 'bg-banking-error hover:bg-red-700',
  }[tone];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('processing');
    // Frontend-only simulated confirmation delay
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => onConfirm?.(), 700);
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 bg-banking-navy/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bg-banking-card w-full sm:max-w-md rounded-t-2xl sm:rounded-lg shadow-xl overflow-hidden animate-fade-in duration-200 max-h-[90vh] flex flex-col">
        <div className="px-5 sm:px-6 py-4 border-b border-border-light flex justify-between items-center bg-gray-50 shrink-0">
          <h3 id="confirm-modal-title" className="font-semibold text-text-primary flex items-center gap-2 text-sm sm:text-base">
            <ShieldCheck size={18} className="text-banking-primary shrink-0" />
            {title}
          </h3>
          {status === 'idle' && (
            <button
              onClick={onCancel}
              aria-label="Close dialog"
              className="text-text-muted hover:text-text-primary p-1 -mr-1"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="overflow-y-auto">
          {status === 'success' ? (
            <div className="p-8 flex flex-col items-center text-center gap-3">
              <CheckCircle2 size={40} className="text-banking-success animate-check-pop" />
              <p className="text-sm font-medium text-text-primary">Action confirmed successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 sm:p-6">
              <div className="text-sm text-text-secondary mb-4 leading-relaxed">{message}</div>

              {requireCode && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Enter Verification Code / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="******"
                    disabled={status === 'processing'}
                    className="w-full px-4 py-3 sm:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-banking-primary text-sm disabled:opacity-60"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={status === 'processing'}
                  className="flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium text-text-secondary bg-white border border-border rounded-md hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'processing'}
                  className={`flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium text-white rounded-md flex items-center justify-center gap-2 ${toneCls} disabled:opacity-80`}
                >
                  {status === 'processing' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    confirmLabel
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
