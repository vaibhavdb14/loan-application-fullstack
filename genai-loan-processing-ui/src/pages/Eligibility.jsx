import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Gauge, ArrowLeft } from 'lucide-react';

/**
 * Placeholder destination for the Digital Profile's "Check Eligibility"
 * CTA. This intentionally does NOT implement the eligibility engine —
 * per scope, that is a separate stage/feature. This page only proves
 * out the navigation handoff from Digital Profile -> Eligibility.
 */
const Eligibility = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams() || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Application
      </button>

      <div className="bg-banking-card border border-border rounded-lg shadow-sm p-8 sm:p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-banking-softBlue rounded-full flex items-center justify-center mb-4">
          <Gauge size={28} className="text-banking-primary" />
        </div>
        <h1 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Eligibility Check</h1>
        <p className="text-sm text-text-secondary max-w-sm">
          Eligibility assessment is coming soon. Your verified Digital Profile is ready to be used as the input for this stage
          once the eligibility engine is connected.
        </p>
      </div>
    </div>
  );
};

export default Eligibility;
