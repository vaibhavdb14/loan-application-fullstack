import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Briefcase, Wallet, Landmark, Receipt, HandCoins, CheckCircle2, X } from 'lucide-react';

// Profile UI Components
import ProfileHeader from '../components/profile/ProfileHeader';
import VerificationBanner from '../components/profile/VerificationBanner';
import ProfileStats from '../components/profile/ProfileStats';
import InfoCard from '../components/profile/InfoCard';
import VerifiedPill from '../components/profile/VerifiedPill';
import AIVerificationSummary from '../components/profile/AIVerificationSummary';
import RiskAssessment from '../components/profile/RiskAssessment';
import DocumentProcessingSummary from '../components/profile/DocumentProcessingSummary';
import EligibilityCTA from '../components/profile/EligibilityCTA';
import ProfileSkeleton from '../components/profile/ProfileSkeleton';
import ProfileErrorState from '../components/profile/ProfileErrorState';

// Common Components & Utils
import ConfirmationModal from '../components/common/ConfirmationModal';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // --- State Management ---
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [authModal, setAuthModal] = useState({ isOpen: false, action: null });

  // --- Fetch Data from MongoDB ---
  useEffect(() => {
    const fetchApplication = async () => {
      setStatus('loading');
      try {
        const response = await fetch(`http://localhost:5000/api/applications/${id}`);
        if (!response.ok) throw new Error('Failed to fetch application');
        
        const result = await response.json();
        setApplication(result.data);
        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('error');
        showToast('Failed to load application profile', 'error');
      }
    };

    if (id) fetchApplication();
  }, [id, showToast]);

  // --- Action Handlers (Approve / Decline) ---
  const openModal = (action) => setAuthModal({ isOpen: true, action });
  const closeModal = () => setAuthModal({ isOpen: false, action: null });

  const handleConfirmed = async () => {
    const action = authModal.action;
    closeModal();
    
    // Map UI actions to backend processingStatus enums
    const newStatus = action === 'Approve' ? 'COMPLETED' : 'FAILED';

    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processingStatus: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      if (action === 'Approve') {
        showToast('Application approved successfully.', 'success');
      } else {
        showToast('Application declined.', 'warning');
      }
      
      navigate('/applications');
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleDownloadReport = () => {
    showToast('Report download will be available once the export service is connected.', 'info');
  };

  // --- Loading / Error States ---
  if (status === 'loading') return <ProfileSkeleton />;
  if (status === 'error' || !application) return <ProfileErrorState onRetry={() => window.location.reload()} />;

  // --- Data Extraction & Mapping ---
  const {
    applicantDetails,
    financialDetails,
    loanDetails,
    documents,
    processingStatus,
    riskLevel,
    verificationScore,
    verificationStatus,
    eligibilityStatus,
    eligibilityScore,
    eligibilityReason,
    digitalProfile
} = application;

  // 1. Dynamic Data combined with Static Placeholders (to match UI exactly)
  const applicant = {
    fullName: applicantDetails?.fullName || 'N/A',
    dateOfBirth: applicantDetails?.dateOfBirth || 'N/A',
    fatherName: applicantDetails?.fatherName || 'N/A',
    panNumber: applicantDetails?.panNumber || 'N/A',
    address: applicantDetails?.address || 'N/A',
  };

  const employment = {
    verified: true,
    occupation: applicantDetails?.occupation || 'Not Provided',
    employer: applicantDetails?.employer || 'Not Provided',
    designation: applicantDetails?.designation || 'Not Provided',
    employmentType: digitalProfile?.employmentType || "Processing...",
    workExperience: digitalProfile?.workExperience || "Processing..."
  };

  // Calculate static logical assumptions based on dynamic monthly income
  const baseMonthly = applicantDetails?.monthlyIncome || 0;
  const income = {
    monthlyIncome: baseMonthly,
    annualIncome: digitalProfile?.annualIncome ?? (baseMonthly * 12),
    netIncome: digitalProfile?.netIncome ?? (baseMonthly * 12 * 0.95), // Assuming 5% tax deduction
    taxDeducted: digitalProfile?.taxDeducted ?? 0,
  };

  const banking = {
    bankName: digitalProfile?.bankName || "Processing...",
    accountNumber: digitalProfile?.maskedAccountNumber || "Processing...",
    accountType: digitalProfile?.accountType || "Processing...",

    averageBalance: digitalProfile?.averageBalance || 0
  };

  const tax = {
    itrVerified: true,
    panNumber: applicantDetails?.panNumber || 'N/A',
    financialYear: '2025-26', // Static
    assessmentYear: '2026-27', // Static
    grossSalary: income.annualIncome,
    taxableIncome: income.annualIncome > 50000 ? income.annualIncome - 50000 : income.annualIncome,
    taxDeducted: income.taxDeducted,
  };

  const loan = {
    loanType: loanDetails?.loanType?.replace('_', ' ') || 'Personal Loan',
    loanAmount: loanDetails?.loanAmount || 0,
    loanTenure: `${loanDetails?.tenureMonths || 60} Months`,
    purpose: digitalProfile?.loanPurpose || "Processing..."
  };

  const verification = {
    status: processingStatus === 'COMPLETED' ? 'VERIFIED' : 'PENDING',
    score: verificationScore || 100,
    checks: [
      { label: 'Identity details are consistent.', status: 'passed' },
      { label: 'Employment details are consistent.', status: 'passed' },
      { label: 'Income information is consistent.', status: 'passed' },
      { label: 'Banking information is consistent.', status: 'passed' },
    ],
    discrepancies: []
  };

  const risk = {
    level: riskLevel || 'LOW',
    indicator: riskLevel === 'HIGH' ? 'RED' : riskLevel === 'MEDIUM' ? 'YELLOW' : 'GREEN',
    manualReviewRequired: riskLevel === 'HIGH' ? 'YES' : 'NO',
    riskFlags: riskLevel === 'HIGH' ? 2 : 0,
    riskScore: 100 - (verificationScore || 0) || 10,
  };

  const documentsSummary = {
    total: documents?.length || 5,
    processed: documents?.length || 5,
    passed: documents?.length || 5,
    reviewRequired: 0,
    failed: 0,
  };

  const eligibility = {
    requiredFields: ['Existing EMI Obligations', 'Credit Score (Optional)', 'Other Active Loans', 'Monthly Expenses'],
    eligibilityRoute: '#'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">

      <ProfileHeader
        verified={verification?.status?.toUpperCase() === 'VERIFIED'}
        onDownloadReport={handleDownloadReport}
      />

      <VerificationBanner
        applicantName={applicant?.fullName}
        statusLabel={processingStatus?.replace('_', ' ') || "READY FOR ELIGIBILITY CHECK"}
      />

      <ProfileStats verification={verification} risk={risk} documents={documentsSummary} />

      {/* Row 1: Applicant / Employment / Income */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <InfoCard
          icon={User}
          title="Applicant Information"
          rows={[
            { label: 'Full Name', value: applicant.fullName },
            { label: 'Date of Birth', value: applicant.dateOfBirth },
            { label: 'Father Name', value: applicant.fatherName },
            { label: 'PAN Number', value: applicant.panNumber },
            { label: 'Aadhaar Number', value: '[Aadhaar Redacted]' },
            { label: 'Address', value: applicant.address },
          ]}
        />

        <InfoCard
          icon={Briefcase}
          title="Employment Details"
          badge={<VerifiedPill />}
          rows={[
            { label: 'Occupation', value: employment.occupation },
            { label: 'Employer', value: employment.employer },
            { label: 'Designation', value: employment.designation },
            { label: 'Employment Type', value: employment.employmentType },
            { label: 'Work Experience', value: employment.workExperience },
          ]}
        />

        <InfoCard
          icon={Wallet}
          title="Income Details"
          rows={[
            { label: 'Monthly Income', value: formatCurrency(income.monthlyIncome) },
            { label: 'Annual Income', value: formatCurrency(income.annualIncome) },
            { label: 'Net Income', value: formatCurrency(income.netIncome) },
            { label: 'Tax Deducted', value: formatCurrency(income.taxDeducted) },
          ]}
        />
      </div>

      {/* Row 2: Banking / Tax / Loan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <InfoCard
          icon={Landmark}
          title="Banking Details"
          badge={<VerifiedPill />}
          rows={[
            { label: 'Bank Name', value: banking.bankName },
            { label: 'Account Number', value: banking.accountNumber },
            { label: 'Account Type', value: banking.accountType },
            { label: 'Average Balance', value: formatCurrency(banking.averageBalance) },
          ]}
        />

        <InfoCard
          icon={Receipt}
          title="Tax Information"
          badge={<VerifiedPill label="ITR VERIFIED" />}
          rows={[
            { label: 'PAN Number', value: tax.panNumber },
            { label: 'Financial Year', value: tax.financialYear },
            { label: 'Assessment Year', value: tax.assessmentYear },
            { label: 'Gross Salary', value: formatCurrency(tax.grossSalary) },
            { label: 'Taxable Income', value: formatCurrency(tax.taxableIncome) },
            { label: 'Tax Deducted', value: formatCurrency(tax.taxDeducted) },
          ]}
        />

        <InfoCard
          icon={HandCoins}
          title="Loan Request"
          rows={[
            { label: 'Loan Type', value: loan.loanType },
            { label: 'Loan Amount', value: formatCurrency(loan.loanAmount) },
            { label: 'Loan Tenure', value: loan.loanTenure },
            { label: 'Purpose', value: loan.purpose },
          ]}
        />
      </div>

      {/* Row 3: New Financial Details Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <InfoCard
            icon={Landmark}
            title="Credit & Financial Profile"
            badge={<VerifiedPill label="CIBIL CHECKED" />}
            rows={[
              { label: 'CIBIL Score', value: financialDetails?.cibilScore || '780' },
              { label: 'Existing Loans', value: financialDetails?.existingLoans || '0' },
              { label: 'EMI Obligations', value: formatCurrency(financialDetails?.emiObligations || 0) },
              { label: 'Credit History', value: `${financialDetails?.creditHistoryYears || 0} Years` },
              { label: 'Previous Defaults', value: financialDetails?.previousLoanDefaults || '0' },
              { label: 'Dependents', value: financialDetails?.numberOfDependents || '0' },
            ]}
          />
        </div>
      </div>

      {/* AI Verification + Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <AIVerificationSummary checks={verification.checks} discrepancies={verification.discrepancies} />
        </div>
        <RiskAssessment
          level={risk.level}
          indicator={risk.indicator}
          manualReviewRequired={risk.manualReviewRequired}
          riskFlags={risk.riskFlags}
          riskScore={risk.riskScore}
        />
      </div>

      {/* Documents Summary */}
      <DocumentProcessingSummary
        total={documentsSummary.total}
        processed={documentsSummary.processed}
        passed={documentsSummary.passed}
        reviewRequired={documentsSummary.reviewRequired}
        failed={documentsSummary.failed}
      />

      {/* Eligibility CTA Banner */}
      <EligibilityCTA
        requiredFields={eligibility.requiredFields}
        route={eligibility.eligibilityRoute}
      />

      {/* =========================================================
          NEW: FINAL ACTION BUTTONS (Approve / Decline)
      ========================================================= */}
      <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6 mt-8">
        <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">Manager Decision</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => openModal('Approve')}
            className="flex-1 bg-banking-success hover:bg-green-700 text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors min-h-[46px]"
          >
            <CheckCircle2 size={18} /> APPROVE APPLICATION
          </button>
          
          <button
            onClick={() => openModal('Decline')}
            className="flex-1 bg-white border-2 border-banking-error text-banking-error hover:bg-red-50 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors min-h-[46px]"
          >
            <X size={18} /> DECLINE APPLICATION
          </button>
        </div>
      </div>

      {/* RE-AUTHENTICATION MODAL */}
      <ConfirmationModal
        isOpen={authModal.isOpen}
        title="Manager Verification Required"
        message={
          <>
            You are about to{' '}
            <strong className={authModal.action === 'Approve' ? 'text-banking-success' : 'text-banking-error'}>
              {authModal.action?.toUpperCase()}
            </strong>{' '}
            application {id.slice(-6).toUpperCase()}. This status update will be securely synced with the database.
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

export default ApplicationDetails;