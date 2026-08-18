import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  X,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useToast } from '../context/ToastContext';

const verificationRows = [
  { field: 'Monthly Income', a: '₹80,000', b: '₹80,000', match: true },
  { field: 'Employer Name', a: 'ABC Tech Pvt Ltd', b: 'ABC Tech Pvt Ltd', match: true },
  { field: 'Current Address', a: 'Navi Mumbai, 400706', b: 'Pune, 411001', match: false },
];

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Modal state for Re-authentication
  const [authModal, setAuthModal] = useState({ isOpen: false, action: null });

  const openModal = (action) => setAuthModal({ isOpen: true, action });
  const closeModal = () => setAuthModal({ isOpen: false, action: null });

  const handleConfirmed = () => {
    const action = authModal.action;
    closeModal();
    if (action === 'Approve') {
      showToast('Application approved successfully.', 'success');
    } else if (action === 'Decline') {
      showToast('Application declined.', 'warning');
    }
    navigate('/applications');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">

      {/* Top Header */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-2">
        <button
          onClick={() => navigate('/applications')}
          className="p-2 hover:bg-gray-100 rounded-full text-text-secondary transition-colors shrink-0"
          aria-label="Back to applications"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-text-primary flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="truncate">Application: {id || 'APP-2026-001025'}</span>
            <StatusBadge status="Pending Review" />
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Submitted on 13 Aug 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* LEFT COLUMN: Main Details & AI Analysis */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">

          {/* SECTION 1: User Details */}
          <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <User size={20} className="text-banking-primary" />
              Applicant Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4 text-sm">
              <div>
                <p className="text-text-secondary mb-1">Full Name</p>
                <p className="font-semibold text-text-primary">Rajesh Kumar</p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Loan Type</p>
                <p className="font-semibold text-text-primary">Personal Loan</p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Requested Amount</p>
                <p className="font-semibold text-text-primary">₹8,50,000</p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">PAN Number</p>
                <p className="font-semibold text-text-primary">ABCDE1234F</p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Monthly Income</p>
                <p className="font-semibold text-text-primary">₹80,000</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: AI / RAG GENERATED SUMMARY */}
          <div className="bg-banking-card border border-banking-info/30 rounded-lg shadow-sm p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-banking-info"></div>
            <h2 className="text-base sm:text-lg font-semibold text-banking-info mb-4 flex items-center gap-2">
              <Sparkles size={20} />
              AI-GENERATED LOAN SUMMARY
            </h2>
            <div className="bg-banking-softBlue/20 p-4 rounded-md text-sm text-text-primary leading-relaxed mb-4 border border-border-light">
              <p className="mb-3">The submitted documents are mostly consistent. The applicant's income and employment information were successfully verified across the Salary Slip and Bank Statement.</p>
              <p><strong>Note:</strong> A minor address mismatch was detected between the Identity Proof and the Bank Statement, requiring manual review.</p>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4">
              <div className="bg-white border border-border-light p-3 rounded-md">
                <p className="text-xs text-text-secondary mb-1">Overall Risk</p>
                <p className="font-semibold text-banking-warning flex items-center gap-2 text-sm sm:text-base">
                  <div className="w-2 h-2 rounded-full bg-banking-warning shrink-0"></div> LOW–MEDIUM
                </p>
              </div>
              <div className="bg-white border border-border-light p-3 rounded-md">
                <p className="text-xs text-text-secondary mb-1">AI Confidence Score</p>
                <p className="font-semibold text-text-primary text-base sm:text-lg">87%</p>
              </div>
            </div>
          </div>

          {/* SECTION 4: Verification Details */}
          <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-4">Cross-Document Verification</h2>

            {/* Desktop / tablet table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="p-3 font-medium text-text-secondary">FIELD</th>
                    <th className="p-3 font-medium text-text-secondary">SALARY SLIP</th>
                    <th className="p-3 font-medium text-text-secondary">BANK STATEMENT</th>
                    <th className="p-3 font-medium text-text-secondary">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {verificationRows.map((r) => (
                    <tr key={r.field} className={r.match ? '' : 'bg-red-50/50'}>
                      <td className={`p-3 font-medium ${r.match ? '' : 'text-banking-error'}`}>{r.field}</td>
                      <td className="p-3">{r.a}</td>
                      <td className="p-3">{r.b}</td>
                      <td className={`p-3 flex items-center gap-1 ${r.match ? 'text-banking-success' : 'text-banking-error'}`}>
                        {r.match ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        {r.match ? 'Match' : 'Mismatch'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile key-value stack */}
            <div className="sm:hidden space-y-3">
              {verificationRows.map((r) => (
                <div key={r.field} className={`rounded-md border p-3 ${r.match ? 'border-border-light' : 'border-red-200 bg-red-50/50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${r.match ? 'text-text-primary' : 'text-banking-error'}`}>{r.field}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${r.match ? 'text-banking-success' : 'text-banking-error'}`}>
                      {r.match ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                      {r.match ? 'Match' : 'Mismatch'}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary space-y-1">
                    <p>Salary Slip: <span className="text-text-primary">{r.a}</span></p>
                    <p>Bank Statement: <span className="text-text-primary">{r.b}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Risk, Documents & Final Actions */}
        <div className="space-y-4 sm:space-y-6">

          {/* SECTION 5: Risk Panel */}
          <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <ShieldAlert size={20} className="text-banking-warning" />
              Risk Exceptions
            </h2>
            <div className="space-y-4">
              <div className="p-3 border border-red-200 bg-red-50 rounded-md">
                <p className="text-sm font-semibold text-banking-error flex items-center gap-2 mb-1">
                  <AlertTriangle size={16} /> Address Discrepancy
                </p>
                <p className="text-xs text-text-secondary mb-2">Mismatch detected between ID Proof and Bank Statement headers.</p>
                <button className="text-xs font-medium text-banking-primary hover:underline">View Evidence</button>
              </div>
            </div>
          </div>

          {/* SECTION 3: Uploaded Documents */}
          <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-4">Uploaded Documents</h2>
            <div className="space-y-3">
              {['Salary_Slip.pdf', 'Bank_Statement.pdf'].map((name) => (
                <div key={name} className="flex items-center justify-between p-3 border border-border-light rounded-md bg-gray-50 gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={18} className="text-text-secondary shrink-0" />
                    <span className="text-sm font-medium truncate" title={name}>{name}</span>
                  </div>
                  <button className="text-xs font-medium text-banking-primary hover:underline shrink-0">View</button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: Final Action */}
          <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">Manager Decision</h2>
            <div className="space-y-3">
              <button
                onClick={() => openModal('Approve')}
                className="w-full bg-banking-success hover:bg-green-700 text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors min-h-[46px]"
              >
                <CheckCircle2 size={18} /> APPROVE APPLICATION
              </button>
              <button
                onClick={() => openModal('Decline')}
                className="w-full bg-white border-2 border-banking-error text-banking-error hover:bg-red-50 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors min-h-[46px]"
              >
                <X size={18} /> DECLINE APPLICATION
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* RE-AUTHENTICATION MODAL */}
      <ConfirmationModal
        isOpen={authModal.isOpen}
        title="Additional Verification Required"
        message={
          <>
            You are about to{' '}
            <strong className={authModal.action === 'Approve' ? 'text-banking-success' : 'text-banking-error'}>
              {authModal.action?.toUpperCase()}
            </strong>{' '}
            application {id}. This sensitive action requires re-authentication.
          </>
        }
        confirmLabel={`Confirm ${authModal.action}`}
        tone={authModal.action === 'Approve' ? 'success' : 'error'}
        onCancel={closeModal}
        onConfirm={handleConfirmed}
      />

    </div>
  );
};

export default ApplicationDetail;
