import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

/**
 * Bottom call-to-action. Navigates into the existing frontend routing
 * structure (does not implement any eligibility logic itself).
 * Required-fields list is API-driven — falls back to nothing shown
 * if the API doesn't return any.
 */
const EligibilityCTA = ({ requiredFields = [], route = '/eligibility' }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg shadow-sm overflow-hidden bg-gradient-to-br from-banking-navy via-banking-primary to-blue-600">
      <div className="p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/15 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck size={26} className="text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">Ready for Eligibility Assessment</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Your profile has been successfully verified. Provide additional details to check your loan eligibility.
            </p>
          </div>
        </div>

        {requiredFields.length > 0 && (
          <div className="bg-white/10 rounded-lg p-4 flex-1 lg:max-w-xs shrink-0">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-3">
              Next, you may need to provide:
            </p>
            <ul className="space-y-2">
              {requiredFields.map((field) => (
                <li key={field} className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle2 size={14} className="text-white/80 shrink-0" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => navigate(route)}
          className="bg-white text-banking-primary hover:bg-gray-50 font-semibold px-6 py-3.5 sm:py-3 rounded-md flex items-center justify-center gap-2 transition-colors shrink-0 w-full lg:w-auto min-h-[48px]"
        >
          Check Eligibility
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="bg-black/10 px-5 sm:px-8 py-2.5 flex items-center gap-1.5 text-[11px] text-white/70">
        <Lock size={11} />
        Your data is secure and encrypted. We follow bank-grade security standards.
      </div>
    </div>
  );
};

export default EligibilityCTA;
