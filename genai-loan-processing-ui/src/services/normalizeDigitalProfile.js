/**
 * normalizeDigitalProfile.js
 *
 * Maps a raw Digital Profile API response into a clean, predictable
 * shape the UI components can rely on, so components never touch
 * raw API field names directly and never break on missing fields.
 *
 * If the backend response shape changes slightly, only this file
 * needs to change — not every component that renders profile data.
 *
 * Every section is optional: if the API omits a section entirely,
 * the corresponding key is simply `null` and the UI components
 * know to skip rendering that card.
 */

const pick = (obj, path, fallback = null) => {
  try {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
};

export const normalizeDigitalProfile = (raw) => {
  if (!raw || typeof raw !== 'object') return null;

  return {
    applicant: raw.applicant
      ? {
          fullName: pick(raw, 'applicant.fullName'),
          dateOfBirth: pick(raw, 'applicant.dateOfBirth'),
          fatherName: pick(raw, 'applicant.fatherName'),
          panNumber: pick(raw, 'applicant.panNumber'),
          aadhaarNumber: pick(raw, 'applicant.aadhaarNumber'),
          address: pick(raw, 'applicant.address'),
          phone: pick(raw, 'applicant.phone'),
          email: pick(raw, 'applicant.email'),
          maritalStatus: pick(raw, 'applicant.maritalStatus'),
          applicationId: pick(raw, 'applicant.applicationId'),
        }
      : null,

    employment: raw.employment
      ? {
          occupation: pick(raw, 'employment.occupation'),
          employer: pick(raw, 'employment.employer'),
          designation: pick(raw, 'employment.designation'),
          employmentType: pick(raw, 'employment.employmentType'),
          workExperience: pick(raw, 'employment.workExperience'),
          joiningDate: pick(raw, 'employment.joiningDate'),
          verified: pick(raw, 'employment.verified', false),
        }
      : null,

    income: raw.income
      ? {
          monthlyIncome: pick(raw, 'income.monthlyIncome'),
          annualIncome: pick(raw, 'income.annualIncome'),
          netIncome: pick(raw, 'income.netIncome'),
          taxDeducted: pick(raw, 'income.taxDeducted'),
          otherIncome: pick(raw, 'income.otherIncome'),
        }
      : null,

    banking: raw.banking
      ? {
          bankName: pick(raw, 'banking.bankName'),
          accountNumber: pick(raw, 'banking.accountNumber'),
          accountType: pick(raw, 'banking.accountType'),
          averageBalance: pick(raw, 'banking.averageBalance'),
          ifsc: pick(raw, 'banking.ifsc'),
          verified: pick(raw, 'banking.verified', false),
        }
      : null,

    tax: raw.tax
      ? {
          panNumber: pick(raw, 'tax.panNumber'),
          financialYear: pick(raw, 'tax.financialYear'),
          assessmentYear: pick(raw, 'tax.assessmentYear'),
          grossSalary: pick(raw, 'tax.grossSalary'),
          taxableIncome: pick(raw, 'tax.taxableIncome'),
          taxDeducted: pick(raw, 'tax.taxDeducted'),
          itrVerified: pick(raw, 'tax.itrVerified', false),
        }
      : null,

    loan: raw.loan
      ? {
          loanType: pick(raw, 'loan.loanType'),
          loanAmount: pick(raw, 'loan.loanAmount'),
          loanTenure: pick(raw, 'loan.loanTenure'),
          purpose: pick(raw, 'loan.purpose'),
          existingEmi: pick(raw, 'loan.existingEmi'),
        }
      : null,

    verification: {
      overallScore: pick(raw, 'verification.overallScore'),
      status: pick(raw, 'verification.status'),
      checks: Array.isArray(pick(raw, 'verification.checks'))
        ? raw.verification.checks
        : [],
      discrepancies: Array.isArray(pick(raw, 'verification.discrepancies'))
        ? raw.verification.discrepancies
        : [],
    },

    risk: raw.risk
      ? {
          level: pick(raw, 'risk.level'),
          indicator: pick(raw, 'risk.indicator'),
          manualReviewRequired: pick(raw, 'risk.manualReviewRequired', false),
          riskFlags: pick(raw, 'risk.riskFlags', 0),
          riskScore: pick(raw, 'risk.riskScore'),
        }
      : null,

    documents: raw.documents
      ? {
          total: pick(raw, 'documents.total', 0),
          processed: pick(raw, 'documents.processed', 0),
          passed: pick(raw, 'documents.passed', 0),
          reviewRequired: pick(raw, 'documents.reviewRequired', 0),
          failed: pick(raw, 'documents.failed', 0),
        }
      : null,

    eligibility: {
      requiredFields: Array.isArray(pick(raw, 'eligibility.requiredFields'))
        ? raw.eligibility.requiredFields
        : [],
      eligibilityRoute: pick(raw, 'eligibility.route', '/eligibility'),
    },

    processing: {
      status: pick(raw, 'processing.status', 'completed'),
    },
  };
};
