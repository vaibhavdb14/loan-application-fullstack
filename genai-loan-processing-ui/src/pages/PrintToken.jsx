import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Landmark, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PrintToken = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-3 sm:p-8 print:p-0 print:bg-white flex flex-col items-center">

      {/* Screen-only controls (Hidden during printing) */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mb-4 sm:mb-6 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary transition-colors bg-white px-4 py-3 sm:py-2 rounded-md shadow-sm border border-border min-h-[44px]"
        >
          <ArrowLeft size={18} /> Back to Application
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-banking-primary text-white hover:bg-blue-700 transition-colors px-4 py-3 sm:py-2 rounded-md shadow-sm min-h-[44px]"
        >
          <Printer size={18} /> Print Token
        </button>
      </div>

      {/* Printable Area */}
      <div className="w-full max-w-2xl bg-white border border-gray-300 shadow-md print:shadow-none print:border-none p-5 sm:p-10 relative">

        {/* Token Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b-2 border-banking-navy pb-6 mb-6">
          <div className="flex items-center gap-3 text-banking-navy">
            <Landmark size={32} className="text-banking-primary shrink-0" />
            <div>
              <h1 className="font-bold text-lg sm:text-xl tracking-wide uppercase">Bank Loan Processing</h1>
              <p className="text-xs text-text-secondary">Official Customer Approval Token</p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-semibold text-text-primary">Token No: TKN-883492</p>
            <p className="text-xs text-text-secondary">Date: 13 Aug 2026</p>
          </div>
        </div>

        {/* Approval Banner */}
        <div className="bg-green-50 border border-green-200 text-banking-success p-4 rounded-md flex items-center justify-center gap-3 mb-8">
          <CheckCircle2 size={22} className="shrink-0" />
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-widest text-center">Application Approved</h2>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-6 gap-x-8 mb-8">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Application ID</p>
            <p className="font-semibold text-text-primary text-base sm:text-lg">{id || 'APP-2026-001025'}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Applicant Name</p>
            <p className="font-semibold text-text-primary text-base sm:text-lg">Rajesh Kumar</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Loan Type</p>
            <p className="font-semibold text-text-primary text-base sm:text-lg">Personal Loan</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Approved Amount</p>
            <p className="font-semibold text-text-primary text-base sm:text-lg">₹8,50,000</p>
          </div>
        </div>

        {/* Next Steps / Instructions */}
        <div className="border-t border-border-light pt-6">
          <h3 className="text-sm font-bold text-text-primary mb-3">Next Steps for Disbursal</h3>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-2">
            <li>Present this token at the branch within 15 days of issuance.</li>
            <li>Carry original copies of the uploaded identity and income proofs.</li>
            <li>Sign the final physical loan agreement and standing instructions (NACH).</li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-8 border-t border-border-light pt-8">
          <div className="text-center w-40">
            <div className="border-b border-border-light mb-2 h-10"></div>
            <p className="text-xs text-text-secondary">Customer Signature</p>
          </div>
          <div className="text-center w-40">
            <div className="border-b border-border-light mb-2 h-10 flex items-end justify-center">
              <span className="font-signature text-banking-primary opacity-50">J. Manager</span>
            </div>
            <p className="text-xs text-text-secondary">Authorized By (Manager)</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrintToken;
