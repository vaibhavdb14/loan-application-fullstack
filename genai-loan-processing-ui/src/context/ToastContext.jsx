import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const config = {
    success: { icon: CheckCircle2, color: 'text-banking-success', bg: 'bg-green-50', border: 'border-green-200' },
    error: { icon: XCircle, color: 'text-banking-error', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { icon: AlertTriangle, color: 'text-banking-warning', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    info: { icon: Info, color: 'text-banking-info', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast viewport - safe on mobile, doesn't cover nav/actions */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm px-0"
        role="region"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const c = config[t.type] || config.info;
          const Icon = c.icon;
          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 ${c.bg} ${c.border} border rounded-lg shadow-lg px-4 py-3 animate-toast-in`}
              role="status"
            >
              <Icon size={18} className={`${c.color} shrink-0 mt-0.5`} />
              <p className="text-sm text-text-primary flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
                className="text-text-muted hover:text-text-primary shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
