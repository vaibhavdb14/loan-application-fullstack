import axios from "axios";
import FinalApplication from "../models/FinalApplication.js";
import cloudinary from "../config/cloudinary.js";

const FASTAPI_BASE_URL =
  process.env.FASTAPI_BASE_URL ||
  "http://127.0.0.1:8000";

const ALLOWED_DOCUMENT_TYPES = [
  "AADHAAR",
  "PAN",
  "PAYSLIP",
  "FORM16",
  "BANK_STATEMENT",
  "OTHER",
];

const MAX_DOCUMENTS_PER_UPLOAD = 5;

// Cloudinary upload
const uploadBufferToCloudinary = (
  buffer,
  folder
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

    uploadStream.end(buffer);
  });
};

// Create application
export const createApplication = async (
  req,
  res
) => {
  try {
    const application =
      await FinalApplication.create(
        req.body
      );

    return res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(
      "CREATE APPLICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all applications
export const getAllApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await FinalApplication.find().sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error(
      "GET ALL APPLICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single application
export const getApplicationById = async (
  req,
  res
) => {
  try {
    const application =
      await FinalApplication.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(
      "GET APPLICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update application
export const updateApplication = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const application =
      await FinalApplication.findByIdAndUpdate(
        id,
        {
          $set: {
            applicantDetails:
              req.body.applicantDetails,
            loanDetails:
              req.body.loanDetails,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Application updated successfully",
      data: application,
    });
  } catch (error) {
    console.error(
      "UPDATE APPLICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload multiple documents
export const addDocuments = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const application =
      await FinalApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const files = req.files || {};

    const documentMappings = [
      {
        fieldName: "aadhaarFile",
        documentType: "AADHAAR",
      },
      {
        fieldName: "panFile",
        documentType: "PAN",
      },
      {
        fieldName: "payslipFile",
        documentType: "PAYSLIP",
      },
      {
        fieldName: "form16File",
        documentType: "FORM16",
      },
      {
        fieldName: "bankStatementFile",
        documentType: "BANK_STATEMENT",
      },
    ];

    const selectedDocuments =
      documentMappings.filter(
        (item) =>
          Array.isArray(
            files[item.fieldName]
          ) &&
          files[item.fieldName].length > 0
      );

    if (selectedDocuments.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one document is required",
      });
    }

    if (
      selectedDocuments.length >
      MAX_DOCUMENTS_PER_UPLOAD
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Maximum ${MAX_DOCUMENTS_PER_UPLOAD} documents can be uploaded at once`,
      });
    }

    const uploadedDocuments = [];

    for (
      const item of selectedDocuments
    ) {
      const file =
        files[item.fieldName][0];

      if (
        !file ||
        !file.buffer ||
        !file.originalname
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid file for ${item.documentType}`,
        });
      }

      if (
        !ALLOWED_DOCUMENT_TYPES.includes(
          item.documentType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Unsupported document type: ${item.documentType}`,
        });
      }

      const alreadyUploaded =
        application.documents.some(
          (document) =>
            document.documentType ===
            item.documentType
        );

      if (alreadyUploaded) {
        return res.status(409).json({
          success: false,
          message:
            `${item.documentType} document already uploaded`,
        });
      }

      const cloudinaryResult =
        await uploadBufferToCloudinary(
          file.buffer,
          `loan-applications/${id}`
        );

      if (
        !cloudinaryResult ||
        !cloudinaryResult.secure_url ||
        !cloudinaryResult.public_id
      ) {
        return res.status(500).json({
          success: false,
          message:
            `Cloudinary upload failed for ${file.originalname}`,
        });
      }

      uploadedDocuments.push({
        documentType:
          item.documentType,
        fileName:
          file.originalname,
        cloudinaryUrl:
          cloudinaryResult.secure_url,
        publicId:
          cloudinaryResult.public_id,
      });
    }

    application.documents.push(
      ...uploadedDocuments
    );

    application.processingStatus =
      "PENDING";

    await application.save();

    return res.status(201).json({
      success: true,
      message:
        "Documents uploaded successfully",
      data: {
        applicationId:
          application._id,
        uploadedDocuments,
        totalDocuments:
          application.documents.length,
        processingStatus:
          application.processingStatus,
        profileStatus:
          application.profileStatus,
        eligibilityStatus:
          application.eligibilityStatus,
      },
    });
  } catch (error) {
    console.error(
      "MULTIPLE DOCUMENT UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Process application using FastAPI
export const processApplication = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const application =
      await FinalApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      !application.applicantDetails ||
      !application.loanDetails
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Applicant details and loan details are required before processing",
      });
    }

    if (
      !Array.isArray(
        application.documents
      ) ||
      application.documents.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload documents before processing",
      });
    }

    if (
      application.documents.length >
      MAX_DOCUMENTS_PER_UPLOAD
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Maximum ${MAX_DOCUMENTS_PER_UPLOAD} documents are supported`,
      });
    }

    const missingUrl =
      application.documents.find(
        (document) =>
          !document.cloudinaryUrl
      );

    if (missingUrl) {
      return res.status(400).json({
        success: false,
        message:
          `${missingUrl.documentType} document does not have a Cloudinary URL`,
      });
    }

    application.processingStatus =
      "PROCESSING";

    await application.save();

    const applicationData = {
      full_name:
        application.applicantDetails
          .fullName,

      date_of_birth:
        application.applicantDetails
          .dateOfBirth,

      father_name:
        application.applicantDetails
          .fatherName,

      pan_number:
        application.applicantDetails
          .panNumber,

      aadhaar_number:
        application.applicantDetails
          .aadhaarNumber,

      occupation:
        application.applicantDetails
          .occupation,

      employer:
        application.applicantDetails
          .employer,

      designation:
        application.applicantDetails
          .designation,

      monthly_income:
        application.applicantDetails
          .monthlyIncome,

      address:
        application.applicantDetails
          .address,

      loan_amount:
        application.loanDetails
          .loanAmount,

      loan_type:
        application.loanDetails
          .loanType,

      loan_tenure_months:
        application.loanDetails
          .tenureMonths,
    };

    const documents =
      application.documents.map(
        (document) => ({
          document_type:
            document.documentType,

          file_name:
            document.fileName,

          url:
            document.cloudinaryUrl,
        })
      );

    const response = await axios.post(
      `${FASTAPI_BASE_URL}/process-application`,
      {
        application_id:
          application._id.toString(),

        application_data:
          applicationData,

        documents,
      },
      {
        timeout: 600000,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

    const aiResult =
      response.data?.data ??
      response.data;

    application.processingStatus =
      "COMPLETED";

    application.profileStatus =
      aiResult?.profile_status ||
      aiResult
        ?.digital_applicant_profile
        ?.profile_status ||
      "READY_FOR_ELIGIBILITY_CHECK";

    // Map verification from the final digital applicant profile
    const verification =
      aiResult
        ?.digital_applicant_profile
        ?.verification
        ?.overall;

    application.verificationStatus =
      verification?.status ??
      null;

    application.verificationScore =
      verification?.overall_score ??
      0;

    application.riskLevel =
      verification?.risk_level ??
      aiResult
        ?.digital_applicant_profile
        ?.verification
        ?.overall
        ?.risk_level ??
      null;

    application.digitalProfile =
      aiResult;

    application.aiProcessedAt =
      new Date();

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Application processed successfully",
      data: {
        applicationId:
          application._id,

        processingStatus:
          application.processingStatus,

        profileStatus:
          application.profileStatus,

        verificationStatus:
          application.verificationStatus,

        verificationScore:
          application.verificationScore,

        riskLevel:
          application.riskLevel,

        digitalProfile:
          application.digitalProfile,
      },
    });
  } catch (error) {
    console.error(
      "PROCESS APPLICATION ERROR:",
      error
    );

    try {
      await FinalApplication.findByIdAndUpdate(
        req.params.id,
        {
          processingStatus:
            "FAILED",
        }
      );
    } catch (updateError) {
      console.error(
        "FAILED STATUS UPDATE ERROR:",
        updateError
      );
    }

    const statusCode =
      error.response?.status ||
      500;

    return res.status(statusCode).json({
      success: false,
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message,
    });
  }
};