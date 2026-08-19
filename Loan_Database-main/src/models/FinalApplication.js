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
      fullName: { type: String, required: true, trim: true },
      dateOfBirth: { type: String, required: true, trim: true },
      fatherName: { type: String, required: true, trim: true },
      panNumber: { type: String, required: true, trim: true },
      aadhaarNumber: { type: String, required: true, trim: true },
      occupation: { type: String, required: true, trim: true },
      employer: { type: String, required: true, trim: true },
      designation: { type: String, required: true, trim: true },
      monthlyIncome: { type: Number, required: true, min: 1 },
      address: { type: String, required: true, trim: true },
    },

    // Financial information
    financialDetails: {
      cibilScore: {
        type: Number,
        default: null,
      },

      existingLoans: {
        type: Number,
        default: 0,
      },

      emiObligations: {
        type: Number,
        default: 0,
      },

      creditHistoryYears: {
        type: Number,
        default: 0,
      },

      previousLoanDefaults: {
        type: Number,
        default: 0,
      },

      numberOfDependents: {
        type: Number,
        default: 0,
      },
    },

    // Financial information
    financialDetails: {
      cibilScore: {
        type: Number,
        default: null,
      },

      existingLoans: {
        type: Number,
        default: 0,
      },

      emiObligations: {
        type: Number,
        default: 0,
      },

      creditHistoryYears: {
        type: Number,
        default: 0,
      },

      previousLoanDefaults: {
        type: Number,
        default: 0,
      },

      numberOfDependents: {
        type: Number,
        default: 0,
      },
    },

    // Loan information
    loanDetails: {
      loanAmount: { type: Number, required: true, min: 1 },

      loanType: {
        type: String,
        required: true,
        enum: [
          "PERSONAL_LOAN",
          "HOME_LOAN",
          "CAR_LOAN",
          "EDUCATION_LOAN",
          "BUSINESS_LOAN",
        ],
      },

      tenureMonths: { type: Number, required: true, min: 1 },
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

    digitalProfile: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

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