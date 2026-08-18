import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

/**
 * Professional error state for a failed Digital Profile request.
 * Never surfaces raw API errors/stack traces to the user.
 */
const ProfileErrorState = ({ onRetry }) => (
  <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
    <div className="bg-banking-card border border-red-200 rounded-lg shadow-sm p-8 sm:p-12 flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-banking-error" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary mb-2">Unable to load your digital profile.</h2>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        Your verification data could not be retrieved right now. Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-banking-primary hover:bg-blue-700 text-white px-5 py-3 sm:py-2.5 rounded-md font-medium transition-colors min-h-[46px]"
      >
        <RotateCcw size={16} />
        Try Again
      </button>
    </div>
  </div>
);

export default ProfileErrorState;
