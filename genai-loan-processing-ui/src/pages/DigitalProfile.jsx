import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Briefcase, Wallet, Landmark, Receipt, HandCoins } from 'lucide-react';

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

import { fetchDigitalProfile } from '../services/digitalProfileService';
import { formatCurrency, maskValue } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const DigitalProfile = () => {
  const { applicationId } = useParams();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error

  const loadProfile = useCallback(async () => {
    setStatus('loading');
    const { data, error } = await fetchDigitalProfile(applicationId);
    if (error || !data) {
      setStatus('error');
      return;
    }
    setProfile(data);
    setStatus('success');
  }, [applicationId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleDownloadReport = () => {
    // Placeholder wiring point: connect to an existing report-download
    // endpoint if/when one exists in the backend. Kept as a toast for now
    // so the button provides real feedback without inventing backend behavior.
    showToast('Report download will be available once the export service is connected.', 'info');
  };

  if (status === 'loading') return <ProfileSkeleton />;
  if (status === 'error') return <ProfileErrorState onRetry={loadProfile} />;
  if (!profile) return <ProfileErrorState onRetry={loadProfile} />;

  const { applicant, employment, income, banking, tax, loan, verification, risk, documents, eligibility } = profile;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">

      <ProfileHeader
        verified={verification?.status?.toUpperCase() === 'VERIFIED'}
        onDownloadReport={handleDownloadReport}
      />

      <VerificationBanner
        applicantName={applicant?.fullName}
        statusLabel="READY FOR ELIGIBILITY CHECK"
      />

      <ProfileStats verification={verification} risk={risk} documents={documents} />

      {/* Applicant / Employment / Income */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {applicant && (
          <InfoCard
            icon={User}
            title="Applicant Information"
            rows={[
              { label: 'Full Name', value: applicant.fullName },
              { label: 'Date of Birth', value: applicant.dateOfBirth },
              { label: 'Father Name', value: applicant.fatherName },
              { label: 'PAN Number', value: applicant.panNumber },
              { label: 'Aadhaar Number', value: applicant.aadhaarNumber ? maskValue(applicant.aadhaarNumber, 4) : null },
              { label: 'Address', value: applicant.address },
            ]}
          />
        )}

        {employment && (
          <InfoCard
            icon={Briefcase}
            title="Employment Details"
            badge={employment.verified && <VerifiedPill />}
            rows={[
              { label: 'Occupation', value: employment.occupation },
              { label: 'Employer', value: employment.employer },
              { label: 'Designation', value: employment.designation },
              { label: 'Employment Type', value: employment.employmentType },
              { label: 'Work Experience', value: employment.workExperience },
            ]}
          />
        )}

        {income && (
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
        )}
      </div>

      {/* Banking / Tax / Loan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {banking && (
          <InfoCard
            icon={Landmark}
            title="Banking Details"
            badge={banking.verified && <VerifiedPill />}
            rows={[
              { label: 'Bank Name', value: banking.bankName },
              { label: 'Account Number', value: banking.accountNumber ? maskValue(banking.accountNumber, 4) : null },
              { label: 'Account Type', value: banking.accountType },
              { label: 'Average Balance', value: formatCurrency(banking.averageBalance) },
            ]}
          />
        )}

        {tax && (
          <InfoCard
            icon={Receipt}
            title="Tax Information"
            badge={tax.itrVerified && <VerifiedPill label="ITR VERIFIED" />}
            rows={[
              { label: 'PAN Number', value: tax.panNumber },
              { label: 'Financial Year', value: tax.financialYear },
              { label: 'Assessment Year', value: tax.assessmentYear },
              { label: 'Gross Salary', value: formatCurrency(tax.grossSalary) },
              { label: 'Taxable Income', value: formatCurrency(tax.taxableIncome) },
              { label: 'Tax Deducted', value: formatCurrency(tax.taxDeducted) },
            ]}
          />
        )}

        {loan && (
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
        )}
      </div>

      {/* AI Verification + Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <AIVerificationSummary checks={verification?.checks} discrepancies={verification?.discrepancies} />
        </div>
        <RiskAssessment
          level={risk?.level}
          indicator={risk?.indicator}
          manualReviewRequired={risk?.manualReviewRequired}
          riskFlags={risk?.riskFlags}
          riskScore={risk?.riskScore}
        />
      </div>

      {documents && (
        <DocumentProcessingSummary
          total={documents.total}
          processed={documents.processed}
          passed={documents.passed}
          reviewRequired={documents.reviewRequired}
          failed={documents.failed}
        />
      )}

      <EligibilityCTA
        requiredFields={eligibility?.requiredFields}
        route={eligibility?.eligibilityRoute}
      />
    </div>
  );
};

export default DigitalProfile;
