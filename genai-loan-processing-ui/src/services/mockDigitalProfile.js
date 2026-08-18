/**
 * mockDigitalProfile.js
 *
 * DEVELOPMENT / DEMO FALLBACK ONLY.
 *
 * This mock mirrors the exact shape the real Digital Profile API is
 * expected to return. It exists purely so the UI is inspectable
 * before the backend endpoint is wired up, and is never imported by
 * production logic directly — `digitalProfileService.js` decides
 * whether to use the real API or this fallback, in one place.
 *
 * Remove this file (and its usage in digitalProfileService.js) once
 * the real backend endpoint is live everywhere.
 */

export const mockDigitalProfile = {
  applicant: {
    fullName: 'Rahul Sharma',
    dateOfBirth: '10/05/1998',
    fatherName: 'Rajesh Sharma',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '1234 5678 9012',
    address: 'Mumbai',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@email.com',
    maritalStatus: 'Single',
    applicationId: 'APP-2026-08-17-001',
  },

  employment: {
    occupation: 'Software Engineer',
    employer: 'Infosys',
    designation: 'Software Engineer',
    employmentType: 'Salaried',
    workExperience: '4 years',
    joiningDate: '01/06/2022',
    verified: true,
  },

  income: {
    monthlyIncome: 68000,
    annualIncome: 780000,
    netIncome: 65000,
    taxDeducted: 35000,
    otherIncome: 0,
  },

  banking: {
    bankName: 'HDFC BANK',
    accountNumber: '50100123457890',
    accountType: 'Savings',
    averageBalance: 150000,
    ifsc: 'HDFC0001234',
    verified: true,
  },

  tax: {
    panNumber: 'ABCDE1234F',
    financialYear: '2025-26',
    assessmentYear: '2026-27',
    grossSalary: 780000,
    taxableIncome: 730000,
    taxDeducted: 35000,
    itrVerified: true,
  },

  loan: {
    loanType: 'Personal Loan',
    loanAmount: 500000,
    loanTenure: '60 Months',
    purpose: 'Home renovation',
    existingEmi: 0,
  },

  verification: {
    overallScore: 100,
    status: 'VERIFIED',
    checks: [
      { key: 'identity', label: 'Identity details are consistent.', passed: true },
      { key: 'employment', label: 'Employment details are consistent.', passed: true },
      { key: 'income', label: 'Income information is consistent.', passed: true },
      { key: 'banking', label: 'Banking information is consistent.', passed: true },
    ],
    discrepancies: [],
  },

  risk: {
    level: 'LOW',
    indicator: 'GREEN',
    manualReviewRequired: false,
    riskFlags: 0,
    riskScore: null,
  },

  documents: {
    total: 5,
    processed: 5,
    passed: 5,
    reviewRequired: 0,
    failed: 0,
  },

  eligibility: {
    requiredFields: [
      'Existing EMI Obligations',
      'Credit Score (Optional)',
      'Other Active Loans',
      'Monthly Expenses',
    ],
    route: '/eligibility',
  },

  processing: {
    status: 'completed',
  },
};
