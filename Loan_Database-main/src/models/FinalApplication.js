// import mongoose from "mongoose";

// // Schema for uploaded documents
// const documentSchema = new mongoose.Schema(
//   {
//     documentType: {
//       type: String,
//       required: true,
//       enum: [
//         "AADHAAR",
//         "PAN",
//         "PAYSLIP",
//         "FORM16",
//         "BANK_STATEMENT",
//         "OTHER",
//       ],
//     },

//     fileName: {
//       type: String,
//       required: true,
//     },

//     cloudinaryUrl: {
//       type: String,
//       required: true,
//     },

//     publicId: {
//       type: String,
//       required: true,
//     },

//     uploadedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { _id: false }
// );

// // Main Loan Application Schema
// const FinalApplicationSchema = new mongoose.Schema(
//   {
//     // Applicant information
//     applicantDetails: {
//       fullName: String,
//       dateOfBirth: String,
//       fatherName: String,
//       panNumber: String,
//       aadhaarNumber: String,
//       occupation: String,
//       employer: String,
//       designation: String,
//       monthlyIncome: Number,
//       address: String,
//     },

//     // Loan information
//     loanDetails: {
//       loanAmount: Number,

//       loanType: {
//         type: String,
//         enum: [
//           "PERSONAL_LOAN",
//           "HOME_LOAN",
//           "CAR_LOAN",
//           "EDUCATION_LOAN",
//           "BUSINESS_LOAN",
//         ],
//       },

//       tenureMonths: Number,
//     },

//     // Uploaded documents
//     documents: {
//       type: [documentSchema],
//       default: [],
//     },

//     // Processing status
//     processingStatus: {
//       type: String,
//       enum: [
//         "PENDING",
//         "PROCESSING",
//         "COMPLETED",
//         "FAILED",
//       ],
//       default: "PENDING",
//     },

//     // Digital profile status
//     profileStatus: {
//       type: String,
//       default: "NOT_GENERATED",
//     },

//     // Verification result
//     verificationStatus: {
//       type: String,
//       default: null,
//     },

//     verificationScore: {
//       type: Number,
//       default: 0,
//     },

//     riskLevel: {
//       type: String,
//       enum: ["LOW", "MEDIUM", "HIGH"],
//       default: null,
//     },

//     // Detailed verification summary
//     verification: {
//       documentConsistencyScore: {
//         type: Number,
//         default: 0,
//       },

//       applicationConsistencyScore: {
//         type: Number,
//         default: 0,
//       },

//       overallScore: {
//         type: Number,
//         default: 0,
//       },

//       status: {
//         type: String,
//         default: null,
//       },

//       indicator: {
//         type: String,
//         default: null,
//       },

//       manualReviewRequired: {
//         type: Boolean,
//         default: false,
//       },

//       crossValidation: {
//         status: {
//           type: String,
//           default: null,
//         },

//         totalDiscrepancies: {
//           type: Number,
//           default: 0,
//         },

//         criticalDiscrepancies: {
//           type: Number,
//           default: 0,
//         },

//         highDiscrepancies: {
//           type: Number,
//           default: 0,
//         },

//         mediumDiscrepancies: {
//           type: Number,
//           default: 0,
//         },
//       },

//       evidenceReconciliation: {
//         status: {
//           type: String,
//           default: null,
//         },

//         score: {
//           type: Number,
//           default: 0,
//         },

//         comparableFields: {
//           type: Number,
//           default: 0,
//         },

//         consistentFields: {
//           type: Number,
//           default: 0,
//         },

//         reviewFields: {
//           type: Number,
//           default: 0,
//         },

//         conflictFields: {
//           type: Number,
//           default: 0,
//         },
//       },
//     },

//     // Final digital applicant profile
//     profile: {
//       identity: {
//         name: String,
//         fatherName: String,
//         dateOfBirth: String,
//         gender: String,
//         address: String,
//         panNumber: String,
//         aadhaarNumber: String,
//       },

//       employment: {
//         employer: String,
//         designation: String,
//         employeeId: String,
//         employmentType: String,
//         joiningDate: String,
//       },

//       income: {
//         monthlyIncome: Number,
//         netIncome: Number,
//         annualIncome: Number,
//         taxDeducted: Number,
//       },

//       banking: {
//         bankName: String,
//         accountNumber: String,
//         accountType: String,
//         currency: String,
//         statementStartDate: String,
//         statementEndDate: String,
//         openingBalance: Number,
//         closingBalance: Number,
//         totalCredits: Number,
//         totalDebits: Number,
//         averageBalance: Number,
//       },

//       tax: {
//         panNumber: String,
//         financialYear: String,
//         assessmentYear: String,
//         grossSalary: Number,
//         taxableIncome: Number,
//         taxDeducted: Number,
//       },
//     },

//     // Final consistency summary
//     summary: {
//       summary: {
//         type: String,
//         default: null,
//       },

//       riskLevel: {
//         type: String,
//         default: null,
//       },

//       manualReviewRequired: {
//         type: Boolean,
//         default: false,
//       },

//       keyDiscrepancies: {
//         type: [String],
//         default: [],
//       },

//       periodDifferences: {
//         type: [String],
//         default: [],
//       },
//     },

//     // Document processing summary
//     documentSummary: {
//       totalDocuments: {
//         type: Number,
//         default: 0,
//       },

//       processed: {
//         type: Number,
//         default: 0,
//       },

//       passed: {
//         type: Number,
//         default: 0,
//       },

//       review: {
//         type: Number,
//         default: 0,
//       },

//       failed: {
//         type: Number,
//         default: 0,
//       },
//     },

//     // Risk flags
//     riskFlags: {
//       type: [mongoose.Schema.Types.Mixed],
//       default: [],
//     },

//     // Loan decision
//     loanDecision: {
//       status: {
//         type: String,
//         default: "NOT_EVALUATED",
//       },

//       score: {
//         type: Number,
//         default: null,
//       },

//       reason: {
//         type: String,
//         default: null,
//       },
//     },

//     // RAG status
//     rag: {
//       status: {
//         type: String,
//         default: null,
//       },

//       profileStatus: {
//         type: String,
//         default: null,
//       },

//       sourceDocumentCount: {
//         type: Number,
//         default: 0,
//       },
//     },

//     // Eligibility result
//     eligibilityStatus: {
//       type: String,
//       enum: [
//         "PENDING",
//         "ELIGIBLE",
//         "NOT_ELIGIBLE",
//         "MANUAL_REVIEW",
//       ],
//       default: "PENDING",
//     },

//     eligibilityScore: {
//       type: Number,
//       default: null,
//     },

//     eligibilityReason: {
//       type: String,
//       default: null,
//     },

//     // AI processing timestamp
//     aiProcessedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const FinalApplication = mongoose.model(
//   "FinalApplication",
//   FinalApplicationSchema
// );

// export default FinalApplication;



import mongoose from "mongoose";

// Schema for uploaded documents
const documentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      required: true,
      enum: [
        "AADHAAR",
        "PAN",
        "PAYSLIP",
        "FORM16",
        "BANK_STATEMENT",
        "OTHER",
      ],
    },

    fileName: {
      type: String,
      required: true,
    },

    cloudinaryUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Main Loan Application Schema
const FinalApplicationSchema = new mongoose.Schema(
  {
    // Applicant information
    applicantDetails: {
      fullName: String,
      dateOfBirth: String,
      fatherName: String,
      panNumber: String,
      aadhaarNumber: String,
      occupation: String,
      employer: String,
      designation: String,
      monthlyIncome: Number,
      address: String,
    },

    // Loan information
    loanDetails: {
      loanAmount: Number,

      loanType: {
        type: String,
        enum: [
          "PERSONAL_LOAN",
          "HOME_LOAN",
          "CAR_LOAN",
          "EDUCATION_LOAN",
          "BUSINESS_LOAN",
        ],
      },

      tenureMonths: Number,
    },

    // Uploaded documents
    documents: {
      type: [documentSchema],
      default: [],
    },

    // Processing status
    processingStatus: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
      ],
      default: "PENDING",
    },

    // Digital profile status
    profileStatus: {
      type: String,
      default: "NOT_GENERATED",
    },

    // Verification result
    verificationStatus: {
      type: String,
      default: null,
    },

    verificationScore: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: null,
    },

    // Eligibility result
    eligibilityStatus: {
      type: String,
      enum: [
        "PENDING",
        "ELIGIBLE",
        "NOT_ELIGIBLE",
        "MANUAL_REVIEW",
      ],
      default: "PENDING",
    },

    eligibilityScore: {
      type: Number,
      default: null,
    },

    eligibilityReason: {
      type: String,
      default: null,
    },

    // Complete GenAI Output
    digitalProfile: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // AI Process Timestamp
    aiProcessedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const FinalApplication = mongoose.model(
  "FinalApplication",
  FinalApplicationSchema
);

export default FinalApplication;