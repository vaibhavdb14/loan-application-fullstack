// 
import React, {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  User,
  Briefcase,
  Wallet,
  Landmark,
  Receipt,
  HandCoins,
  CheckCircle2,
  X,
  AlertTriangle,
  FileText,
  ExternalLink,
  Eye,
  Activity,
  Sparkles,
} from 'lucide-react';

import ProfileHeader from '../components/profile/ProfileHeader';
import VerificationBanner from '../components/profile/VerificationBanner';
import ProfileStats from '../components/profile/ProfileStats';
import InfoCard from '../components/profile/InfoCard';
import VerifiedPill from '../components/profile/VerifiedPill';
import AIVerificationSummary from '../components/profile/AIVerificationSummary';
import RiskAssessment from '../components/profile/RiskAssessment';
import DocumentProcessingSummary from '../components/profile/DocumentProcessingSummary';
import ProfileSkeleton from '../components/profile/ProfileSkeleton';
import ProfileErrorState from '../components/profile/ProfileErrorState';
import ConfirmationModal from '../components/common/ConfirmationModal';

import {
  formatCurrency,
  maskValue,
} from '../utils/formatters';

import { useToast } from '../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000';

const humanizeField = (field) => {
  if (!field) {
    return 'Unknown Field';
  }

  const labels = {
    name: 'Applicant Name',
    date_of_birth: 'Date of Birth',
    pan_number: 'PAN Number',
    aadhaar_number: 'Aadhaar Number',
    father_name: "Father's Name",
    employer: 'Employer',
    designation: 'Designation',
    employment_type: 'Employment Type',
    employee_id: 'Employee ID',
    joining_date: 'Joining Date',
    gross_income: 'Gross Income',
    net_income: 'Net Income',
    annual_income: 'Annual Income',
    tax_deducted: 'Tax Deducted',
    bank_name: 'Bank Name',
    account_holder: 'Account Holder',
    account_number: 'Account Number',
    account_type: 'Account Type',
  };

  if (labels[field]) {
    return labels[field];
  }

  return String(field)
    .replace(/_/g, ' ')
    .replace(/\./g, ' ')
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

const safeDisplayValue = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(safeDisplayValue)
      .filter(Boolean)
      .join(', ');
  }

  if (typeof value === 'object') {
    if (
      value.field !== undefined &&
      value.reason !== undefined
    ) {
      return `${humanizeField(
        value.field
      )}: ${safeDisplayValue(
        value.reason
      )}`;
    }

    if (value.message !== undefined) {
      return safeDisplayValue(
        value.message
      );
    }

    if (value.reason !== undefined) {
      return safeDisplayValue(
        value.reason
      );
    }

    if (value.field !== undefined) {
      return humanizeField(
        value.field
      );
    }

    if (value.value !== undefined) {
      return safeDisplayValue(
        value.value
      );
    }

    return '';
  }

  return String(value);
};

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [application, setApplication] =
    useState(null);

  const [digitalProfile, setDigitalProfile] =
    useState(null);

  const [status, setStatus] =
    useState('loading');

  const [authModal, setAuthModal] =
    useState({
      isOpen: false,
      action: null,
    });

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setStatus('error');
        return;
      }

      try {
        setStatus('loading');

        const [
          applicationResponse,
          digitalProfileResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/applications/${id}`
          ),

          fetch(
            `${API_BASE_URL}/api/applications/${id}/digital-profile`
          ),
        ]);

        if (!applicationResponse.ok) {
          throw new Error(
            'Failed to fetch application'
          );
        }

        const applicationResult =
          await applicationResponse.json();

        if (!applicationResult?.success) {
          throw new Error(
            applicationResult?.message ||
              'Failed to load application'
          );
        }

        setApplication(
          applicationResult.data
        );

        if (
          digitalProfileResponse.ok
        ) {
          const digitalResult =
            await digitalProfileResponse.json();

          if (digitalResult?.success) {
            setDigitalProfile(
              digitalResult.data
            );
          }
        }

        setStatus('success');
      } catch (error) {
        console.error(
          'APPLICATION DETAILS ERROR:',
          error
        );

        setStatus('error');

        showToast(
          'Failed to load application details',
          'error'
        );
      }
    };

    loadData();
  }, [id, showToast]);

  const openModal = (action) => {
    setAuthModal({
      isOpen: true,
      action,
    });
  };

  const closeModal = () => {
    setAuthModal({
      isOpen: false,
      action: null,
    });
  };

  const handleConfirmed = async () => {
    const action = authModal.action;

    closeModal();

    const newStatus =
      action === 'Approve'
        ? 'COMPLETED'
        : 'FAILED';

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/applications/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            processingStatus:
              newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to update application status'
        );
      }

      showToast(
        action === 'Approve'
          ? 'Application approved successfully.'
          : 'Application declined.',
        action === 'Approve'
          ? 'success'
          : 'warning'
      );

      navigate('/applications');
    } catch (error) {
      showToast(
        `Error: ${error.message}`,
        'error'
      );
    }
  };

  const handleDownloadReport = () => {
    showToast(
      'Report export is not connected yet.',
      'info'
    );
  };

  if (status === 'loading') {
    return <ProfileSkeleton />;
  }

  if (
    status === 'error' ||
    !application
  ) {
    return (
      <ProfileErrorState
        onRetry={() =>
          window.location.reload()
        }
      />
    );
  }

  const {
    applicantDetails,
    financialDetails,
    loanDetails,
    documents,
    profileStatus,
    verificationStatus,
    verificationScore,
    riskLevel,
    eligibilityStatus,
  } = application;

  const ai =
    digitalProfile?.digitalProfile ||
    {};

  const processingSummary =
    ai.processing_summary || {};

  const validation =
    ai.validation || {};

  const evidenceReconciliation =
    ai.evidence_reconciliation || {};

  const consistencySummary =
    ai.consistency_summary || {};

  const aiProfile =
    ai.digital_applicant_profile || {};

  const verificationRoot =
    aiProfile.verification || {};

  const overallVerification =
    verificationRoot.overall || {};

  const reconciledData =
    evidenceReconciliation
      .reconciled_data || {};

  const employmentFields =
    reconciledData.employment || {};

  const incomeFields =
    reconciledData.income || {};

  const bankingFields =
    reconciledData.banking || {};

  const taxFields =
    reconciledData.tax || {};

  const discrepancies =
    Array.isArray(
      evidenceReconciliation.conflicts
    )
      ? evidenceReconciliation.conflicts
      : [];

  const verificationData = {
    overallScore:
      verificationScore ??
      overallVerification.overall_score ??
      null,

    status:
      verificationStatus ??
      overallVerification.status ??
      'PENDING',

    manualReviewRequired:
      consistencySummary
        .manual_review_required ??
      overallVerification
        .manual_review_required ??
      false,

    checks:
      Array.isArray(
        verificationRoot.checks
      )
        ? verificationRoot.checks
        : [],

    discrepancies,
  };

  const effectiveRiskLevel =
    consistencySummary.risk_level ||
    riskLevel ||
    null;

  const riskFlags =
    discrepancies
      .map((conflict) =>
        safeDisplayValue(
          conflict
        )
      )
      .filter(Boolean);

  const riskData = {
    level: effectiveRiskLevel,

    indicator:
      overallVerification.indicator ||
      (
        effectiveRiskLevel ===
        'HIGH'
          ? 'RED'
          : null
      ),

    manualReviewRequired:
      consistencySummary
        .manual_review_required ??
      false,

    riskFlags,

    riskScore: null,
  };

  const documentData = {
    total:
      documents?.length ??
      ai.total_documents ??
      0,

    processed:
      processingSummary
        .processed_documents ??
      documents?.length ??
      0,

    passed:
      processingSummary
        .passed_documents ??
      0,

    reviewRequired:
      processingSummary
        .review_documents ??
      0,

    failed:
      processingSummary
        .failed_documents ??
      0,

    overallStatus:
      ai.overall_status ??
      null,

    validationStatus:
      validation.status ??
      null,
  };

  const consistencyScore =
    evidenceReconciliation
      .consistency_score ??
    null;

  const consistencyStatus =
    evidenceReconciliation
      .consistency_status ??
    null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">

      <ProfileHeader
        verificationStatus={
          verificationData.status
        }
        profileStatus={
          profileStatus
        }
        verificationScore={
          verificationData.overallScore
        }
        onDownloadReport={
          handleDownloadReport
        }
      />

      <VerificationBanner
        applicantName={
          applicantDetails?.fullName
        }
        verificationStatus={
          verificationData.status
        }
        profileStatus={
          profileStatus
        }
        statusLabel={
          profileStatus ===
          'REVIEW_REQUIRED'
            ? 'REVIEW REQUIRED'
            : verificationData.status
        }
      />

      <ProfileStats
        verification={
          verificationData
        }
        risk={riskData}
        documents={
          documentData
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        <InfoCard
          icon={User}
          title="Applicant Information"
          rows={[
            {
              label: 'Full Name',
              value:
                applicantDetails?.fullName,
            },
            {
              label:
                'Date of Birth',
              value:
                applicantDetails?.dateOfBirth,
            },
            {
              label:
                'Father Name',
              value:
                applicantDetails?.fatherName,
            },
            {
              label:
                'PAN Number',
              value:
                applicantDetails?.panNumber,
            },
            {
              label:
                'Aadhaar Number',
              value:
                applicantDetails
                  ?.aadhaarNumber
                  ? maskValue(
                      applicantDetails.aadhaarNumber,
                      4
                    )
                  : null,
            },
            {
              label:
                'Occupation',
              value:
                applicantDetails?.occupation,
            },
            {
              label:
                'Employer',
              value:
                applicantDetails?.employer,
            },
            {
              label:
                'Designation',
              value:
                applicantDetails?.designation,
            },
            {
              label:
                'Address',
              value:
                applicantDetails?.address,
            },
          ]}
        />

        <InfoCard
          icon={Briefcase}
          title="Employment Details"
          badge={
            employmentFields
              ?.employer
              ?.status ? (
              <VerifiedPill
                status={
                  employmentFields
                    .employer
                    .status
                }
              />
            ) : null
          }
          rows={[
            {
              label:
                'Occupation',
              value:
                applicantDetails
                  ?.occupation ||
                null,
            },
            {
              label:
                'Employer',
              value:
                employmentFields
                  ?.employer
                  ?.value ??
                applicantDetails
                  ?.employer ??
                null,
            },
            {
              label:
                'Designation',
              value:
                employmentFields
                  ?.designation
                  ?.value ??
                applicantDetails
                  ?.designation ??
                null,
            },
            {
              label:
                'Employment Type',
              value:
                employmentFields
                  ?.employment_type
                  ?.value ??
                null,
            },
            {
              label:
                'Employee ID',
              value:
                employmentFields
                  ?.employee_id
                  ?.value ??
                null,
            },
            {
              label:
                'Joining Date',
              value:
                employmentFields
                  ?.joining_date
                  ?.value ??
                null,
            },
          ]}
        />

        <InfoCard
          icon={Wallet}
          title="Income Details"
          badge={
            incomeFields
              ?.gross_income
              ?.status ? (
              <VerifiedPill
                status={
                  incomeFields
                    .gross_income
                    .status
                }
              />
            ) : null
          }
          rows={[
            {
              label:
                'Monthly Income',
              value:
                applicantDetails
                  ?.monthlyIncome !=
                null
                  ? formatCurrency(
                      applicantDetails
                        .monthlyIncome
                    )
                  : null,
            },
            {
              label:
                'Income Source',
              value:
                incomeFields
                  ?.income_source
                  ?.value ??
                null,
            },
            {
              label:
                'Gross Income',
              value:
                incomeFields
                  ?.gross_income
                  ?.value !=
                null
                  ? formatCurrency(
                      incomeFields
                        .gross_income
                        .value
                    )
                  : null,
            },
            {
              label:
                'Annual Income',
              value:
                incomeFields
                  ?.annual_income
                  ?.value !=
                null
                  ? formatCurrency(
                      incomeFields
                        .annual_income
                        .value
                    )
                  : null,
            },
            {
              label:
                'Net Income',
              value:
                incomeFields
                  ?.net_income
                  ?.value !=
                null
                  ? formatCurrency(
                      incomeFields
                        .net_income
                        .value
                    )
                  : null,
            },
            {
              label:
                'Tax Deducted',
              value:
                incomeFields
                  ?.tax_deducted
                  ?.value !=
                null
                  ? formatCurrency(
                      incomeFields
                        .tax_deducted
                        .value
                    )
                  : null,
            },
            {
              label:
                'Income Period',
              value:
                incomeFields
                  ?.income_period
                  ?.value ??
                null,
            },
          ]}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        <InfoCard
          icon={Landmark}
          title="Banking Details"
          badge={
            bankingFields
              ?.account_number
              ?.status ? (
              <VerifiedPill
                status={
                  bankingFields
                    .account_number
                    .status
                }
              />
            ) : null
          }
          rows={[
            {
              label:
                'Bank Name',
              value:
                bankingFields
                  ?.bank_name
                  ?.value ??
                null,
            },
            {
              label:
                'Account Holder',
              value:
                bankingFields
                  ?.account_holder
                  ?.value ??
                null,
            },
            {
              label:
                'Account Number',
              value:
                bankingFields
                  ?.account_number
                  ?.value
                  ? maskValue(
                      bankingFields
                        .account_number
                        .value,
                      4
                    )
                  : null,
            },
            {
              label:
                'Account Type',
              value:
                bankingFields
                  ?.account_type
                  ?.value ??
                null,
            },
            {
              label:
                'Currency',
              value:
                bankingFields
                  ?.currency
                  ?.value ??
                null,
            },
            {
              label:
                'Opening Balance',
              value:
                bankingFields
                  ?.opening_balance
                  ?.value !=
                null
                  ? formatCurrency(
                      bankingFields
                        .opening_balance
                        .value
                    )
                  : null,
            },
            {
              label:
                'Closing Balance',
              value:
                bankingFields
                  ?.closing_balance
                  ?.value !=
                null
                  ? formatCurrency(
                      bankingFields
                        .closing_balance
                        .value
                    )
                  : null,
            },
            {
              label:
                'Average Balance',
              value:
                bankingFields
                  ?.average_balance
                  ?.value !=
                null
                  ? formatCurrency(
                      bankingFields
                        .average_balance
                        .value
                    )
                  : null,
            },
            {
              label:
                'Total Credits',
              value:
                bankingFields
                  ?.total_credits
                  ?.value !=
                null
                  ? formatCurrency(
                      bankingFields
                        .total_credits
                        .value
                    )
                  : null,
            },
            {
              label:
                'Total Debits',
              value:
                bankingFields
                  ?.total_debits
                  ?.value !=
                null
                  ? formatCurrency(
                      bankingFields
                        .total_debits
                        .value
                    )
                  : null,
            },
          ]}
        />

        <InfoCard
          icon={Receipt}
          title="Tax Information"
          badge={
            taxFields
              ?.pan_number
              ?.status ? (
              <VerifiedPill
                status={
                  taxFields
                    .pan_number
                    .status
                }
              />
            ) : null
          }
          rows={[
            {
              label:
                'PAN Number',
              value:
                taxFields
                  ?.pan_number
                  ?.value ??
                applicantDetails
                  ?.panNumber ??
                null,
            },
            {
              label:
                'Financial Year',
              value:
                taxFields
                  ?.financial_year
                  ?.value ??
                null,
            },
            {
              label:
                'Assessment Year',
              value:
                taxFields
                  ?.assessment_year
                  ?.value ??
                null,
            },
            {
              label:
                'Gross Salary',
              value:
                taxFields
                  ?.gross_salary
                  ?.value !=
                null
                  ? formatCurrency(
                      taxFields
                        .gross_salary
                        .value
                    )
                  : null,
            },
            {
              label:
                'Gross Total Income',
              value:
                taxFields
                  ?.gross_total_income
                  ?.value !=
                null
                  ? formatCurrency(
                      taxFields
                        .gross_total_income
                        .value
                    )
                  : null,
            },
            {
              label:
                'Taxable Income',
              value:
                taxFields
                  ?.taxable_income
                  ?.value !=
                null
                  ? formatCurrency(
                      taxFields
                        .taxable_income
                        .value
                    )
                  : null,
            },
            {
              label:
                'Tax Deducted',
              value:
                taxFields
                  ?.tax_deducted
                  ?.value !=
                null
                  ? formatCurrency(
                      taxFields
                        .tax_deducted
                        .value
                    )
                  : null,
            },
          ]}
        />

        <InfoCard
          icon={HandCoins}
          title="Loan Request"
          rows={[
            {
              label:
                'Loan Type',
              value:
                loanDetails
                  ?.loanType
                  ? loanDetails.loanType.replace(
                      /_/g,
                      ' '
                    )
                  : null,
            },
            {
              label:
                'Loan Amount',
              value:
                loanDetails
                  ?.loanAmount !=
                null
                  ? formatCurrency(
                      loanDetails.loanAmount
                    )
                  : null,
            },
            {
              label:
                'Loan Tenure',
              value:
                loanDetails
                  ?.tenureMonths !=
                null
                  ? `${loanDetails.tenureMonths} Months`
                  : null,
            },
          ]}
        />

      </div>

      <InfoCard
        icon={Landmark}
        title="Credit & Financial Profile"
        rows={[
          {
            label:
              'CIBIL Score',
            value:
              financialDetails
                ?.cibilScore ??
              null,
          },
          {
            label:
              'Existing Loans',
            value:
              financialDetails
                ?.existingLoans ??
              null,
          },
          {
            label:
              'EMI Obligations',
            value:
              financialDetails
                ?.emiObligations !=
              null
                ? formatCurrency(
                    financialDetails
                      .emiObligations
                  )
                : null,
          },
          {
            label:
              'Credit History',
            value:
              financialDetails
                ?.creditHistoryYears !=
              null
                ? `${financialDetails.creditHistoryYears} Years`
                : null,
          },
          {
            label:
              'Previous Defaults',
            value:
              financialDetails
                ?.previousLoanDefaults ??
              null,
          },
          {
            label:
              'Dependents',
            value:
              financialDetails
                ?.numberOfDependents ??
              null,
          },
        ]}
      />

      <section className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">

        <div className="flex items-center gap-2 mb-4">

          <Activity
            size={18}
            className="text-banking-primary"
          />

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-text-primary">
              Document Consistency
            </h3>

            <p className="text-xs text-text-secondary">
              Cross-document evidence reconciliation
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">

          <MetricBox
            label="Consistency Score"
            value={
              consistencyScore !=
              null
                ? `${Number(
                    consistencyScore
                  ).toFixed(2)}%`
                : '—'
            }
            danger={
              Number(
                consistencyScore || 0
              ) < 80
            }
          />

          <MetricBox
            label="Weighted Fields"
            value={
              evidenceReconciliation
                ?.weighted_fields ??
              0
            }
          />

          <MetricBox
            label="Comparable"
            value={
              evidenceReconciliation
                ?.comparable_fields ??
              0
            }
          />

          <MetricBox
            label="Consistent"
            value={
              evidenceReconciliation
                ?.consistent_fields ??
              0
            }
            success
          />

          <MetricBox
            label="Conflicts"
            value={
              evidenceReconciliation
                ?.conflict_fields ??
              0
            }
            danger
          />

          <MetricBox
            label="Single Source"
            value={
              evidenceReconciliation
                ?.single_source_fields ??
              0
            }
          />

          <MetricBox
            label="Not Comparable"
            value={
              evidenceReconciliation
                ?.not_comparable_fields ??
              0
            }
          />

        </div>

        <div className="mt-4">

          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-banking-error border border-red-200">
            {safeDisplayValue(
              consistencyStatus
            ) || 'N/A'}
          </span>

        </div>

      </section>

      <section className="bg-banking-card border border-yellow-200 rounded-lg shadow-sm overflow-hidden">

        <div className="p-4 sm:p-6">

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">

                <Sparkles
                  size={19}
                  className="text-banking-warning"
                />

              </div>

              <div>

                <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                  AI-Generated Consistency Assessment
                </h3>

                <p className="text-xs text-text-secondary mt-1">
                  Final AI interpretation of submitted document evidence
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3 shrink-0">

              <div className="text-right">

                <p className="text-xs text-text-secondary">
                  Consistency Score
                </p>

                <p className="text-2xl font-bold text-banking-error">

                  {consistencyScore !=
                  null
                    ? `${Number(
                        consistencyScore
                      ).toFixed(2)}%`
                    : '—'}

                </p>

              </div>

              <span className="px-3 py-1.5 rounded-full bg-red-50 text-banking-error border border-red-200 text-xs font-bold">

                {safeDisplayValue(
                  consistencySummary?.risk_level
                ) || 'REVIEW'}

              </span>

            </div>

          </div>

          {consistencySummary?.summary && (
            <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-banking-warning mb-2">
                AI Summary
              </p>

              <p className="text-sm sm:text-base text-text-primary leading-relaxed">
                {safeDisplayValue(
                  consistencySummary.summary
                )}
              </p>

            </div>
          )}

          {consistencySummary?.consistency_explanation && (
            <div className="mt-4 bg-gray-50 border border-border-light rounded-lg p-4 sm:p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
                AI Explanation
              </p>

              <p className="text-sm text-text-secondary leading-relaxed">
                {safeDisplayValue(
                  consistencySummary
                    .consistency_explanation
                )}
              </p>

            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div className="flex items-center gap-2">

              {consistencySummary
                ?.manual_review_required ? (
                <>
                  <AlertTriangle
                    size={17}
                    className="text-banking-warning"
                  />

                  <span className="text-sm font-semibold text-banking-warning">
                    Manual review required
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={17}
                    className="text-banking-success"
                  />

                  <span className="text-sm font-semibold text-banking-success">
                    No manual review required
                  </span>
                </>
              )}

            </div>

            <span className="text-xs font-semibold text-text-secondary">
              {safeDisplayValue(
                consistencyStatus
              ) || 'N/A'}
            </span>

          </div>

        </div>

      </section>

      {(
        consistencySummary
          ?.key_consistent_evidence ||
        []
      ).length > 0 && (
        <section className="bg-banking-card border border-green-200 rounded-lg shadow-sm p-4 sm:p-6">

          <div className="flex items-center gap-2 mb-4">

            <CheckCircle2
              size={18}
              className="text-banking-success"
            />

            <div>

              <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                Key Consistent Evidence
              </h3>

              <p className="text-xs text-text-secondary">
                AI-identified consistent evidence
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {consistencySummary
              .key_consistent_evidence
              .map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-md bg-green-50 border border-green-200"
                  >

                    <CheckCircle2
                      size={16}
                      className="text-banking-success shrink-0 mt-0.5"
                    />

                    <span className="text-sm text-text-secondary leading-relaxed">
                      {safeDisplayValue(
                        item
                      )}
                    </span>

                  </div>
                )
              )}

          </div>

        </section>
      )}

      {(
        consistencySummary
          ?.key_discrepancies ||
        []
      ).length > 0 && (
        <section className="bg-banking-card border border-red-200 rounded-lg shadow-sm p-4 sm:p-6">

          <div className="flex items-center gap-2 mb-4">

            <AlertTriangle
              size={18}
              className="text-banking-error"
            />

            <div>

              <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                Key Discrepancies
              </h3>

              <p className="text-xs text-text-secondary">
                AI-generated summary of critical conflicts
              </p>

            </div>

          </div>

          <div className="space-y-3">

            {consistencySummary
              .key_discrepancies
              .map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200"
                  >

                    <AlertTriangle
                      size={16}
                      className="text-banking-error shrink-0 mt-0.5"
                    />

                    <span className="text-sm text-text-secondary leading-relaxed">
                      {safeDisplayValue(
                        item
                      )}
                    </span>

                  </div>
                )
              )}

          </div>

        </section>
      )}

      {(
        consistencySummary
          ?.period_differences ||
        []
      ).length > 0 && (
        <section className="bg-banking-card border border-cyan-200 rounded-lg shadow-sm p-4 sm:p-6">

          <div className="flex items-center gap-2 mb-4">

            <Activity
              size={18}
              className="text-banking-info"
            />

            <div>

              <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                Valid Period Differences
              </h3>

              <p className="text-xs text-text-secondary">
                Valid reporting-period differences, not conflicts
              </p>

            </div>

          </div>

          <div className="space-y-2">

            {consistencySummary
              .period_differences
              .map(
                (item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-cyan-50 border border-cyan-100 rounded-md text-sm text-text-secondary leading-relaxed"
                  >
                    {safeDisplayValue(
                      item
                    )}
                  </div>
                )
              )}

          </div>

        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="lg:col-span-2">

          <AIVerificationSummary
            checks={
              verificationData.checks
            }
            discrepancies={
              verificationData.discrepancies
            }
            overallScore={
              verificationData.overallScore
            }
            verificationStatus={
              verificationData.status
            }
            manualReviewRequired={
              verificationData
                .manualReviewRequired
            }
          />

        </div>

        <RiskAssessment
          level={
            riskData.level
          }
          indicator={
            riskData.indicator
          }
          manualReviewRequired={
            riskData
              .manualReviewRequired
          }
          riskFlags={
            riskData.riskFlags
          }
          riskScore={
            riskData.riskScore
          }
        />

      </div>

      {ai.application_consistency && (
        <section className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">

          <div className="flex items-center gap-2 mb-4">

            <Activity
              size={18}
              className="text-banking-primary"
            />

            <div>

              <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                Application Consistency
              </h3>

              <p className="text-xs text-text-secondary">
                Application data compared with document evidence
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            <MetricBox
              label="Score"
              value={
                ai.application_consistency
                  ?.application_consistency
                  ?.score != null
                  ? `${Number(
                      ai.application_consistency
                        .application_consistency
                        .score
                    ).toFixed(2)}%`
                  : '—'
              }
            />

            <MetricBox
              label="Comparable"
              value={
                ai.application_consistency
                  ?.application_consistency
                  ?.comparable_fields ??
                0
              }
            />

            <MetricBox
              label="Matched"
              value={
                ai.application_consistency
                  ?.application_consistency
                  ?.matched_fields ??
                0
              }
              success
            />

            <MetricBox
              label="Conflicts"
              value={
                ai.application_consistency
                  ?.application_consistency
                  ?.conflict_fields ??
                0
              }
              danger
            />

            <MetricBox
              label="Critical"
              value={
                ai.application_consistency
                  ?.application_consistency
                  ?.critical_conflicts ??
                0
              }
              danger
            />

          </div>

        </section>
      )}

      <section className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">

        <div className="flex items-center gap-2 mb-5">

          <FileText
            size={18}
            className="text-banking-primary"
          />

          <div>

            <h3 className="text-sm sm:text-base font-semibold text-text-primary">
              Uploaded Documents
            </h3>

            <p className="text-xs text-text-secondary">
              {documents?.length || 0} original documents
            </p>

          </div>

        </div>

        <div className="space-y-3">

          {documents?.map(
            (
              document,
              index
            ) => (
              <div
                key={
                  document.publicId ||
                  `${document.fileName}-${index}`
                }
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-border-light rounded-lg p-3"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <FileText
                    size={18}
                    className="text-banking-primary shrink-0"
                  />

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-text-primary truncate">
                      {safeDisplayValue(
                        document.fileName
                      )}
                    </p>

                    <p className="text-xs text-text-secondary">
                      {safeDisplayValue(
                        document.documentType
                      )}
                    </p>

                  </div>

                </div>

                {document.cloudinaryUrl && (
                  <a
                    href={
                      document.cloudinaryUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-banking-primary text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >

                    <Eye
                      size={15}
                    />

                    View Original

                    <ExternalLink
                      size={13}
                    />

                  </a>
                )}

              </div>
            )
          )}

        </div>

      </section>

      <DocumentProcessingSummary
        total={
          documentData.total
        }
        processed={
          documentData.processed
        }
        passed={
          documentData.passed
        }
        reviewRequired={
          documentData.reviewRequired
        }
        failed={
          documentData.failed
        }
      />

      <section className="rounded-lg shadow-sm overflow-hidden bg-gradient-to-br from-banking-navy via-banking-primary to-blue-600">

        <div className="p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <h3 className="text-lg font-bold text-white">
              Continue to Eligibility Assessment
            </h3>

            <p className="text-sm text-white/80 mt-1 max-w-2xl">

              {verificationData
                .manualReviewRequired
                ? 'The AI profile has been processed and manual review has been flagged. Continue to the eligibility assessment when ready.'
                : 'The digital profile has been processed successfully. Continue to the eligibility assessment.'}

            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/eligibility/${id}`
              )
            }
            className="bg-white text-banking-primary hover:bg-gray-50 font-semibold px-6 py-3 rounded-md inline-flex items-center justify-center gap-2 shrink-0"
          >

            Check Eligibility

            <span
              aria-hidden="true"
              className="text-lg leading-none"
            >
              →
            </span>

          </button>

        </div>

        <div className="bg-black/10 px-5 sm:px-8 py-2.5 text-[11px] text-white/70">

          Eligibility Status:{' '}

          <span className="font-semibold">
            {safeDisplayValue(
              eligibilityStatus
            ) || 'PENDING'}
          </span>

        </div>

      </section>

      <div className="bg-banking-card border border-border rounded-lg shadow-sm p-4 sm:p-6">

        <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
          Manager Decision
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">

          <button
            type="button"
            onClick={() =>
              openModal(
                'Approve'
              )
            }
            className="flex-1 bg-banking-success hover:bg-green-700 text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors min-h-[46px]"
          >

            <CheckCircle2
              size={18}
            />

            APPROVE APPLICATION

          </button>

          <button
            type="button"
            onClick={() =>
              openModal(
                'Decline'
              )
            }
            className="flex-1 bg-white border-2 border-banking-error text-banking-error hover:bg-red-50 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors min-h-[46px]"
          >

            <X
              size={18}
            />

            DECLINE APPLICATION

          </button>

        </div>

        {profileStatus ===
          'REVIEW_REQUIRED' && (
          <div className="mt-4 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-md p-3">

            <AlertTriangle
              size={17}
              className="text-banking-warning shrink-0 mt-0.5"
            />

            <p className="text-sm text-text-secondary">

              This application currently requires
              manual review based on the AI verification
              result. Eligibility status:{' '}

              <strong>
                {safeDisplayValue(
                  eligibilityStatus
                ) || 'PENDING'}
              </strong>.

            </p>

          </div>
        )}

      </div>

      <ConfirmationModal
        isOpen={
          authModal.isOpen
        }
        title="Manager Verification Required"
        message={
          <>
            You are about to{' '}

            <strong
              className={
                authModal.action ===
                'Approve'
                  ? 'text-banking-success'
                  : 'text-banking-error'
              }
            >
              {safeDisplayValue(
                authModal.action
              ).toUpperCase()}
            </strong>

            {' '}

            application{' '}

            {safeDisplayValue(
              id
            )
              .slice(-6)
              .toUpperCase()}.

            This status update will be securely synced
            with the database.
          </>
        }
        confirmLabel={
          `Confirm ${authModal.action || ''}`
        }
        tone={
          authModal.action ===
          'Approve'
            ? 'success'
            : 'error'
        }
        onCancel={
          closeModal
        }
        onConfirm={
          handleConfirmed
        }
      />

    </div>
  );
};

const MetricBox = ({
  label,
  value,
  success = false,
  danger = false,
}) => {
  let className =
    'bg-gray-50 border-border-light text-text-primary';

  if (success) {
    className =
      'bg-green-50 border-green-200 text-green-800';
  }

  if (danger) {
    className =
      'bg-red-50 border-red-200 text-red-800';
  }

  return (
    <div
      className={`border rounded-lg p-3 ${className}`}
    >
      <p className="text-xs opacity-75">
        {safeDisplayValue(label)}
      </p>

      <p className="text-sm font-bold mt-1 break-words">
        {safeDisplayValue(value) || '—'}
      </p>
    </div>
  );
};

export default ApplicationDetails;