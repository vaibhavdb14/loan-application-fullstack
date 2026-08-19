// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Check,
//   FileText,
//   ChevronRight,
//   ChevronLeft,
//   CheckCircle2,
//   ShieldCheck,
//   Loader2,
// } from "lucide-react";

// import UploadCard from "../components/documents/UploadCard";
// import ProcessingStatus from "../components/processing/ProcessingStatus";
// import { useToast } from "../context/ToastContext";

// /* =========================================================
//    REQUIRED DOCUMENTS
// ========================================================= */
// const REQUIRED_DOCS = [
//   { key: "salary", label: "Salary Slip" },
//   { key: "bank", label: "Bank Statement" },
//   { key: "id", label: "PAN / Identity Proof" },
//   { key: "address", label: "Address Proof" },
// ];

// /* =========================================================
//    AI PROCESSING PIPELINE
// ========================================================= */
// const PIPELINE_STAGES = [
//   { key: "upload", label: "Document Upload & Pre-processing", threshold: 15 },
//   { key: "classify", label: "Document Classification", threshold: 30 },
//   { key: "extract", label: "GenAI Data Extraction", threshold: 45 },
//   { key: "verify", label: "Cross-document Verification", threshold: 60 },
//   { key: "risk", label: "Risk & Exception Detection", threshold: 75 },
//   { key: "summary", label: "AI Summary Generation", threshold: 100 },
// ];

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */
// const NewApplication = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { showToast } = useToast();

//   const isClientApplication = location.pathname === "/client/new";

//   // --- Core States ---
//   const [step, setStep] = useState(1);
//   const [applicationId, setApplicationId] = useState(null);

//   // --- Processing States ---
//   const [isSavingText, setIsSavingText] = useState(false); // Step 1 API call
//   const [isUploadingDocs, setIsUploadingDocs] = useState(false); // Step 2 API call
//   const [isProcessing, setIsProcessing] = useState(false); // Final Step API call
//   const [processingProgress, setProcessingProgress] = useState(0);
//   const [submissionComplete, setSubmissionComplete] = useState(false);

//   // --- Form & File Data ---
//   const [formData, setFormData] = useState({
//     fullName: "",
//     dateOfBirth: "",
//     fatherName: "",
//     panNumber: "",
//     aadhaarNumber: "",
//     occupation: "",
//     employer: "",
//     designation: "",
//     monthlyIncome: "",
//     address: "",
//     loanType: "",
//     loanAmount: "",
//     tenureMonths: "",
//   });

//   const [docStatus, setDocStatus] = useState(
//     REQUIRED_DOCS.reduce((acc, document) => ({ ...acc, [document.key]: "idle" }), {})
//   );
//   const [uploadedFiles, setUploadedFiles] = useState({});

//   /* =========================================================
//      HANDLERS
//   ========================================================= */
//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleDocStatusChange = (docLabel, status, file = null) => {
//     const doc = REQUIRED_DOCS.find((document) => document.label === docLabel);
//     if (!doc) return;

//     setDocStatus((previous) => ({ ...previous, [doc.key]: status }));

//     if (file) {
//       setUploadedFiles((prev) => ({ ...prev, [doc.key]: file }));
//     }
//   };

//   const completedDocs = Object.values(docStatus).filter(
//     (status) => status === "complete"
//   ).length;
//   const allDocsComplete = completedDocs === REQUIRED_DOCS.length;

//   /* =========================================================
//      PHASE 1: SAVE TEXT DATA & PROCEED
//   ========================================================= */
//   const saveTextDataAndContinue = async () => {
//     setIsSavingText(true);

//     const payload = {
//       applicantDetails: {
//         fullName: formData.fullName,
//         dateOfBirth: formData.dateOfBirth,
//         fatherName: formData.fatherName,
//         panNumber: formData.panNumber,
//         aadhaarNumber: formData.aadhaarNumber,
//         occupation: formData.occupation,
//         employer: formData.employer,
//         designation: formData.designation,
//         monthlyIncome: Number(formData.monthlyIncome) || 0,
//         address: formData.address,
//       },
//       loanDetails: {
//         loanAmount: Number(formData.loanAmount.toString().replace(/[^0-9.-]+/g, "")) || 0,
//         loanType: formData.loanType
//           ? formData.loanType.toUpperCase().replace(" ", "_")
//           : "PERSONAL_LOAN",
//         tenureMonths: Number(formData.tenureMonths) || 60,
//       },
//       processingStatus: "PENDING",
//     };

//     try {
//       const response = await fetch("http://localhost:5000/api/applications/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Backend Error: ${errorData.message || response.statusText}`);
//       }

//       const result = await response.json();
//       const generatedId = result.data._id;

//       localStorage.setItem("currentApplicationId", generatedId);
//       setApplicationId(generatedId);
//       setStep(2);
//     } catch (error) {
//       console.error("Failed to save text data:", error);
//       showToast(`Error: ${error.message}`, "error");
//     } finally {
//       setIsSavingText(false);
//     }
//   };

//   /* =========================================================
//      PHASE 2: UPLOAD DOCUMENTS & PROCEED
//   ========================================================= */
//   const uploadDocumentsAndContinue = async () => {
//     const savedId = localStorage.getItem("currentApplicationId");

//     if (!savedId) {
//       showToast("Application ID is missing. Please review Step 1.", "error");
//       return;
//     }

//     setIsUploadingDocs(true);

//     try {
//       const docFormData = new FormData();
//       if (uploadedFiles.id) docFormData.append("panFile", uploadedFiles.id);
//       if (uploadedFiles.address) docFormData.append("aadhaarFile", uploadedFiles.address);
//       if (uploadedFiles.salary) docFormData.append("payslipFile", uploadedFiles.salary);
//       if (uploadedFiles.bank) docFormData.append("bankStatementFile", uploadedFiles.bank);

//       const docResponse = await fetch(`http://localhost:5000/api/applications/${savedId}/upload`, {
//         method: "POST",
//         body: docFormData,
//       });

//       if (!docResponse.ok) {
//         const errorText = await docResponse.text();
//         throw new Error(`Document upload failed: ${errorText}`);
//       }

//       // Proceed to Step 3 (Review & Submit) once documents are safely in Cloudinary/MongoDB
//       setStep(3);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       showToast("Failed to upload documents.", "error");
//     } finally {
//       setIsUploadingDocs(false);
//     }
//   };

//   /* =========================================================
//      PHASE 3: START GEN AI PROCESSING (Final Submit)
//   ========================================================= */
//   const startProcessing = async () => {
//     const savedId = localStorage.getItem("currentApplicationId");

//     if (!savedId) {
//       showToast("Application ID is missing.", "error");
//       return;
//     }

//     setIsProcessing(true);
//     setSubmissionComplete(false);

//     // TODO LATER: Trigger the GenAI processing route here 
//     // e.g., await fetch(`http://localhost:5000/api/applications/${savedId}/process`, { method: 'POST' });

//     // Visual Processing Simulation (Until backend AI is connected)
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += Math.floor(Math.random() * 8) + 6;

//       if (progress >= 100) {
//         progress = 100;
//         clearInterval(interval);
//         setProcessingProgress(100);

//         if (isClientApplication) {
//           showToast("Application submitted successfully.", "success");
//           setTimeout(() => {
//             setIsProcessing(false);
//             setSubmissionComplete(true);
//             setProcessingProgress(0);
//             setStep(1);
//             setApplicationId(null);
//           }, 1200);
//           return;
//         }

//         showToast("Analysis completed. Application is ready for review.", "success");
//         setTimeout(() => {
//           navigate("/applications");
//         }, 900);
//       } else {
//         setProcessingProgress(progress);
//       }
//     }, 500);
//   };

//   const handleStartAnotherApplication = () => {
//     localStorage.removeItem("currentApplicationId");
//     setFormData({
//       fullName: "", dateOfBirth: "", fatherName: "", panNumber: "", aadhaarNumber: "",
//       occupation: "", employer: "", designation: "", monthlyIncome: "", address: "",
//       loanType: "", loanAmount: "", tenureMonths: "",
//     });
//     setDocStatus(REQUIRED_DOCS.reduce((acc, doc) => ({ ...acc, [doc.key]: "idle" }), {}));
//     setUploadedFiles({});
//     setApplicationId(null);
//     setSubmissionComplete(false);
//     setStep(1);
//   };

//   /* =========================================================
//      UPDATED WIZARD STEPS
//   ========================================================= */
//   const steps = [
//     { num: 1, title: "Application Details" },
//     { num: 2, title: "Documents" },
//     { num: 3, title: "Review & Submit" },
//   ];

//   /* =========================================================
//      RENDER: SUCCESS & PROCESSING SCREENS
//   ========================================================= */
//   if (submissionComplete && isClientApplication) {
//     return (
//       <div className="min-h-screen bg-banking-background flex items-center justify-center p-4 sm:p-6">
//         <div className="w-full max-w-2xl bg-banking-card border border-border rounded-xl shadow-sm p-6 sm:p-10 text-center">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
//             <CheckCircle2 size={40} className="text-banking-success" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Application Submitted Successfully</h1>
//           <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg mx-auto">
//             Your loan application and documents have been submitted successfully. Our AI-assisted processing system will analyze your application.
//           </p>
//           <button
//             type="button"
//             onClick={handleStartAnotherApplication}
//             className="mt-7 w-full sm:w-auto bg-banking-primary hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors min-h-[46px]"
//           >
//             Start Another Application
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (isProcessing) {
//     const pipelineSteps = PIPELINE_STAGES.map((stage) => ({
//       key: stage.key,
//       label: stage.label,
//       status: processingProgress >= stage.threshold ? "complete" : processingProgress > stage.threshold - 15 ? "active" : "idle",
//     }));

//     return (
//       <div className="min-h-screen bg-banking-background p-4 sm:p-6 lg:p-8">
//         <div className="max-w-3xl mx-auto mt-4 sm:mt-10">
//           <div className="bg-banking-card border border-border p-6 sm:p-10 rounded-xl shadow-sm text-center">
//             <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 rounded-full bg-banking-softBlue flex items-center justify-center">
//               <div className="w-6 h-6 sm:w-7 sm:h-7 border-[3px] border-banking-primary border-t-transparent rounded-full animate-spin" />
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">Analyzing Application</h2>
//             <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
//               <div className="bg-banking-primary h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(processingProgress, 100)}%` }} />
//             </div>
//             <div className="text-sm font-semibold text-banking-primary mb-6">
//               {Math.min(processingProgress, 100)}% Complete
//             </div>
//             <div className="max-w-md mx-auto text-left">
//               <ProcessingStatus steps={pipelineSteps} orientation="vertical" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* =========================================================
//      MAIN APPLICATION UI
//   ========================================================= */
//   return (
//     <div className="min-h-screen bg-banking-background p-4 sm:p-6 lg:p-8">
//       <div className="max-w-5xl mx-auto">
//         {isClientApplication && (
//           <div className="mb-6 bg-banking-softBlue border border-blue-200 rounded-lg p-4 flex items-start gap-3">
//             <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center shrink-0">
//               <ShieldCheck size={18} className="text-banking-primary" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-text-primary">Secure Loan Application</p>
//               <p className="text-xs text-text-secondary mt-1 leading-relaxed">
//                 Complete the steps below to submit your loan application securely.
//               </p>
//             </div>
//           </div>
//         )}

//         <div className="mb-6 sm:mb-8">
//           <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
//             {isClientApplication ? "Start Your Loan Application" : "File New Application"}
//           </h1>
//         </div>

//         {/* STEPPER */}
//         <div className="mb-6 sm:mb-8">
//           <div className="hidden sm:flex items-center justify-between relative">
//             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-light -z-10" />
//             {steps.map((currentStep) => (
//               <div key={currentStep.num} className="flex flex-col items-center bg-banking-background px-4">
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${
//                     step > currentStep.num
//                       ? "bg-banking-success border-banking-success text-white"
//                       : step === currentStep.num
//                         ? "bg-banking-primary border-banking-primary text-white"
//                         : "bg-banking-card border-border text-text-muted"
//                   }`}
//                 >
//                   {step > currentStep.num ? <Check size={20} /> : currentStep.num}
//                 </div>
//                 <span className={`text-sm mt-2 font-medium ${step >= currentStep.num ? "text-text-primary" : "text-text-muted"}`}>
//                   {currentStep.title}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* APPLICATION WIZARD CARDS */}
//         <div className="bg-banking-card border border-border rounded-lg shadow-sm">
//           <div className="p-4 sm:p-8 min-h-[400px]">
//             {/* STEP 1: COMBINED APPLICANT & LOAN DETAILS */}
//             {step === 1 && (
//               <div className="space-y-10 animate-in fade-in duration-300">
//                 <div>
//                   <h2 className="text-lg sm:text-xl font-semibold text-text-primary border-b border-border-light pb-4 mb-6">
//                     A. Applicant Personal Information
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
//                     <InputField label="Full Name" name="fullName" placeholder="e.g., Rahul Sharma" value={formData.fullName} onChange={handleInputChange} />
//                     <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
//                     <InputField label="Father's Name" name="fatherName" placeholder="e.g., Bikram Sharma" value={formData.fatherName} onChange={handleInputChange} />
//                     <InputField label="PAN Number" name="panNumber" placeholder="e.g., ABCDE1234F" value={formData.panNumber} onChange={handleInputChange} />
//                     <InputField label="Aadhaar Number" name="aadhaarNumber" placeholder="[Aadhaar Redacted]" value={formData.aadhaarNumber} onChange={handleInputChange} />
//                     <div className="col-span-1 md:col-span-2">
//                       <label className="block text-sm font-medium text-text-primary mb-1">Residential Address</label>
//                       <textarea
//                         name="address"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 sm:py-2 border border-border rounded-md focus:ring-2 focus:ring-banking-primary focus:outline-none text-sm text-text-primary bg-white"
//                         rows="3"
//                         placeholder="e.g., Mumbai"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h2 className="text-lg sm:text-xl font-semibold text-text-primary border-b border-border-light pb-4 mb-6">
//                     B. Employment & Loan Requirements
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
//                     <InputField label="Occupation" name="occupation" placeholder="e.g., Software Engineer" value={formData.occupation} onChange={handleInputChange} />
//                     <InputField label="Employer" name="employer" placeholder="e.g., Infosys" value={formData.employer} onChange={handleInputChange} />
//                     <InputField label="Designation" name="designation" placeholder="e.g., Software Engineer" value={formData.designation} onChange={handleInputChange} />
//                     <InputField label="Monthly Income (₹)" name="monthlyIncome" type="number" placeholder="e.g., 68000" value={formData.monthlyIncome} onChange={handleInputChange} />
                    
//                     <div className="col-span-1 md:col-span-2 mt-2">
//                       <label className="block text-sm font-medium text-text-primary mb-1">Loan Type</label>
//                       <select
//                         name="loanType"
//                         value={formData.loanType}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 sm:py-2 border border-border rounded-md focus:ring-2 focus:ring-banking-primary focus:outline-none text-sm text-text-primary bg-white"
//                       >
//                         <option value="">Select a loan type...</option>
//                         <option value="Personal Loan">Personal Loan</option>
//                         <option value="Home Loan">Home Loan</option>
//                         <option value="Business Loan">Business Loan</option>
//                       </select>
//                     </div>

//                     {formData.loanType && (
//                       <>
//                         <InputField label="Requested Amount (₹)" name="loanAmount" type="number" placeholder="e.g., 500000" value={formData.loanAmount} onChange={handleInputChange} />
//                         <InputField label="Tenure (Months)" name="tenureMonths" type="number" placeholder="e.g., 60" value={formData.tenureMonths} onChange={handleInputChange} />
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: DOCUMENTS */}
//             {step === 2 && (
//               <div className="space-y-6 animate-in fade-in duration-300">
//                 <div className="flex items-center justify-between border-b border-border-light pb-4 flex-wrap gap-2">
//                   <h2 className="text-lg sm:text-xl font-semibold text-text-primary">2. Document Upload</h2>
//                   <span className="text-xs sm:text-sm font-medium text-text-secondary">
//                     {completedDocs}/{REQUIRED_DOCS.length} Required Documents Ready
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {REQUIRED_DOCS.map((doc) => (
//                     <UploadCard key={doc.key} docType={doc.label} required onStatusChange={handleDocStatusChange} />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* STEP 3: REVIEW & SUBMIT */}
//             {step === 3 && (
//               <div className="space-y-6 animate-in fade-in duration-300">
//                 <h2 className="text-lg sm:text-xl font-semibold text-text-primary border-b border-border-light pb-4">
//                   3. Review & Submit
//                 </h2>
//                 <div className="bg-banking-background p-4 sm:p-6 rounded-lg border border-border-light">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
//                     <div>
//                       <span className="text-text-secondary block mb-1">Applicant Name</span>
//                       <span className="font-semibold text-text-primary">{formData.fullName || "Not Provided"}</span>
//                     </div>
//                     <div>
//                       <span className="text-text-secondary block mb-1">PAN Number</span>
//                       <span className="font-semibold text-text-primary">{formData.panNumber || "Not Provided"}</span>
//                     </div>
//                     <div>
//                       <span className="text-text-secondary block mb-1">Loan Type</span>
//                       <span className="font-semibold text-text-primary">{formData.loanType || "Not Provided"}</span>
//                     </div>
//                     <div>
//                       <span className="text-text-secondary block mb-1">Requested Amount</span>
//                       <span className="font-semibold text-text-primary">
//                         {formData.loanAmount ? `₹${Number(formData.loanAmount).toLocaleString()}` : "Not Provided"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <h4 className="text-sm font-medium text-text-primary">Documents</h4>
//                   {REQUIRED_DOCS.map((document) => (
//                     <div key={document.key} className="flex items-center justify-between p-3 border border-border-light rounded-md bg-white">
//                       <div className="flex items-center gap-3 min-w-0">
//                         <FileText size={18} className="text-text-secondary shrink-0" />
//                         <span className="text-sm font-medium truncate">{document.label}</span>
//                       </div>
//                       {docStatus[document.key] === "complete" ? (
//                         <span className="text-xs font-medium text-banking-success bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1">
//                           <Check size={12} /> Ready
//                         </span>
//                       ) : (
//                         <span className="text-xs font-medium text-banking-warning bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
//                           Pending
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* FOOTER NAVIGATION */}
//           <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-border-light bg-gray-50 flex justify-between rounded-b-lg gap-3">
//             <button
//               type="button"
//               onClick={() => setStep(step - 1)}
//               disabled={step === 1 || isUploadingDocs}
//               className={`px-4 sm:px-5 py-3 sm:py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors min-h-[46px] ${
//                 step === 1 || isUploadingDocs
//                   ? "opacity-50 cursor-not-allowed text-text-muted"
//                   : "text-text-primary bg-white border border-border hover:bg-gray-100"
//               }`}
//             >
//               <ChevronLeft size={18} /> <span className="hidden sm:inline">Back</span>
//             </button>

//             {step === 1 ? (
//               <button
//                 type="button"
//                 onClick={saveTextDataAndContinue}
//                 disabled={isSavingText}
//                 className="bg-banking-primary hover:bg-blue-700 text-white px-4 sm:px-5 py-3 sm:py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors min-h-[46px]"
//               >
//                 {isSavingText ? <Loader2 size={18} className="animate-spin" /> : "Next Step"}
//                 {!isSavingText && <ChevronRight size={18} />}
//               </button>
//             ) : step === 2 ? (
//               <button
//                 type="button"
//                 onClick={uploadDocumentsAndContinue}
//                 disabled={!allDocsComplete || isUploadingDocs}
//                 className="bg-banking-primary hover:bg-blue-700 text-white px-4 sm:px-5 py-3 sm:py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors min-h-[46px] disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isUploadingDocs ? <Loader2 size={18} className="animate-spin" /> : "Next Step"}
//                 {!isUploadingDocs && <ChevronRight size={18} />}
//               </button>
//             ) : (
//               <button
//                 type="button"
//                 onClick={startProcessing}
//                 disabled={isProcessing}
//                 className="bg-banking-success hover:bg-green-700 text-white px-5 sm:px-6 py-3 sm:py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors min-h-[46px] disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Submit Application <Check size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    REUSABLE INPUT FIELD
// ========================================================= */
// const InputField = ({ label, type = "text", placeholder, name, value, onChange }) => {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full px-4 py-3 sm:py-2 border border-border rounded-md focus:ring-2 focus:ring-banking-primary focus:outline-none text-sm text-text-primary bg-white"
//       />
//     </div>
//   );
// };

// export default NewApplication;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Check,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import UploadCard from "../components/documents/UploadCard";
import ProcessingStatus from "../components/processing/ProcessingStatus";
import { useToast } from "../context/ToastContext";

/* =========================================================
   REQUIRED DOCUMENTS (Updated with Form 16)
========================================================= */
const REQUIRED_DOCS = [
  { key: "salary", label: "Salary Slip" },
  { key: "bank", label: "Bank Statement" },
  { key: "id", label: "PAN / Identity Proof" },
  { key: "address", label: "Address Proof" },
  { key: "form16", label: "Form 16" },
];

/* =========================================================
   AI PROCESSING PIPELINE
========================================================= */
const PIPELINE_STAGES = [
  { key: "upload", label: "Document Upload & Pre-processing", threshold: 15 },
  { key: "classify", label: "Document Classification", threshold: 30 },
  { key: "extract", label: "GenAI Data Extraction", threshold: 45 },
  { key: "verify", label: "Cross-document Verification", threshold: 60 },
  { key: "risk", label: "Risk & Exception Detection", threshold: 75 },
  { key: "summary", label: "AI Summary Generation", threshold: 100 },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */
const NewApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const isClientApplication = location.pathname === "/client/new";

  // --- Core States ---
  const [step, setStep] = useState(1);
  const [applicationId, setApplicationId] = useState(null);

  // --- Processing States ---
  const [isSavingText, setIsSavingText] = useState(false);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  // --- Form & File Data (Updated with Financial Details) ---
  const [formData, setFormData] = useState({
    // Applicant Details
    fullName: "",
    dateOfBirth: "",
    fatherName: "",
    panNumber: "",
    aadhaarNumber: "",
    occupation: "",
    employer: "",
    designation: "",
    monthlyIncome: "",
    address: "",
    // Financial Details
    cibilScore: "",
    existingLoans: "",
    emiObligations: "",
    creditHistoryYears: "",
    previousLoanDefaults: "",
    numberOfDependents: "",
    // Loan Details
    loanType: "",
    loanAmount: "",
    tenureMonths: "",
  });

  const [docStatus, setDocStatus] = useState(
    REQUIRED_DOCS.reduce((acc, document) => ({ ...acc, [document.key]: "idle" }), {})
  );
  const [uploadedFiles, setUploadedFiles] = useState({});

  /* =========================================================
     HANDLERS
  ========================================================= */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocStatusChange = (docLabel, status, file = null) => {
    const doc = REQUIRED_DOCS.find((document) => document.label === docLabel);
    if (!doc) return;

    setDocStatus((previous) => ({ ...previous, [doc.key]: status }));

    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [doc.key]: file }));
    }
  };

  const completedDocs = Object.values(docStatus).filter(
    (status) => status === "complete"
  ).length;
  const allDocsComplete = completedDocs === REQUIRED_DOCS.length;

  const requiredFields = [
    ["fullName", "Full Name"],
    ["dateOfBirth", "Date of Birth"],
    ["fatherName", "Father's Name"],
    ["panNumber", "PAN Number"],
    ["aadhaarNumber", "Aadhaar Number"],
    ["address", "Residential Address"],
    ["occupation", "Occupation"],
    ["employer", "Employer"],
    ["designation", "Designation"],
    ["monthlyIncome", "Monthly Income"],
    ["loanType", "Loan Type"],
    ["loanAmount", "Requested Amount"],
    ["tenureMonths", "Tenure"],
  ];

  /* =========================================================
     PHASE 1: SAVE TEXT DATA & PROCEED
  ========================================================= */
  const saveTextDataAndContinue = async () => {
    const missingField = requiredFields.find(
      ([field]) => !String(formData[field]).trim()
    );

    if (missingField) {
      showToast(`${missingField[1]} is required.`, "error");
      return;
    }

    setIsSavingText(true);

    // Updated payload to match new Mongoose Schema
    const payload = {
      applicantDetails: {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        fatherName: formData.fatherName,
        panNumber: formData.panNumber,
        aadhaarNumber: formData.aadhaarNumber,
        occupation: formData.occupation,
        employer: formData.employer,
        designation: formData.designation,
        monthlyIncome: Number(formData.monthlyIncome) || 0,
        address: formData.address,
      },
      financialDetails: {
        cibilScore: formData.cibilScore ? Number(formData.cibilScore) : null,
        existingLoans: Number(formData.existingLoans) || 0,
        emiObligations: Number(formData.emiObligations) || 0,
        creditHistoryYears: Number(formData.creditHistoryYears) || 0,
        previousLoanDefaults: Number(formData.previousLoanDefaults) || 0,
        numberOfDependents: Number(formData.numberOfDependents) || 0,
      },
      loanDetails: {
        loanAmount: Number(formData.loanAmount.toString().replace(/[^0-9.-]+/g, "")) || 0,
        loanType: formData.loanType
          ? formData.loanType.toUpperCase().replace(" ", "_")
          : "PERSONAL_LOAN",
        tenureMonths: Number(formData.tenureMonths) || 60,
      },
      processingStatus: "PENDING",
    };

    try {
      const response = await fetch("http://localhost:5000/api/applications/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Backend Error: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      const generatedId = result.data._id;

      localStorage.setItem("currentApplicationId", generatedId);
      setApplicationId(generatedId);
      setStep(2);
    } catch (error) {
      console.error("Failed to save text data:", error);
      showToast(`Error: ${error.message}`, "error");
    } finally {
      setIsSavingText(false);
    }
  };

  /* =========================================================
     PHASE 2: UPLOAD DOCUMENTS & PROCEED
  ========================================================= */
  const uploadDocumentsAndContinue = async () => {
    const savedId = localStorage.getItem("currentApplicationId");

    if (!savedId) {
      showToast("Application ID is missing. Please review Step 1.", "error");
      return;
    }

    setIsUploadingDocs(true);

    try {
      const docFormData = new FormData();
      if (uploadedFiles.id) docFormData.append("panFile", uploadedFiles.id);
      if (uploadedFiles.address) docFormData.append("aadhaarFile", uploadedFiles.address);
      if (uploadedFiles.salary) docFormData.append("payslipFile", uploadedFiles.salary);
      if (uploadedFiles.bank) docFormData.append("bankStatementFile", uploadedFiles.bank);
      if (uploadedFiles.form16) docFormData.append("form16File", uploadedFiles.form16); // Added Form 16

      const docResponse = await fetch(`http://localhost:5000/api/applications/${savedId}/upload`, {
        method: "POST",
        body: docFormData,
      });

      if (!docResponse.ok) {
        const errorText = await docResponse.text();
        throw new Error(`Document upload failed: ${errorText}`);
      }

      setStep(3);
    } catch (error) {
      console.error("Upload failed:", error);
      showToast("Failed to upload documents.", "error");
    } finally {
      setIsUploadingDocs(false);
    }
  };

  /* =========================================================
     PHASE 3: START GEN AI PROCESSING (Final Submit)
  ========================================================= */
  const startProcessing = async () => {
    const savedId = localStorage.getItem("currentApplicationId");

    if (!savedId) {
      showToast("Application ID is missing.", "error");
      return;
    }

    setIsProcessing(true);
    setSubmissionComplete(false);

    // Visual Processing Simulation (Until backend AI is connected)
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 6;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setProcessingProgress(100);

        if (isClientApplication) {
          showToast("Application submitted successfully.", "success");
          setTimeout(() => {
            setIsProcessing(false);
            setSubmissionComplete(true);
            setProcessingProgress(0);
            setStep(1);
            setApplicationId(null);
          }, 1200);
          return;
        }

        showToast("Analysis completed. Application is ready for review.", "success");
        setTimeout(() => {
          navigate("/applications");
        }, 900);
      } else {
        setProcessingProgress(progress);
      }
    }, 500);
  };

  const handleStartAnotherApplication = () => {
    localStorage.removeItem("currentApplicationId");
    setFormData({
      fullName: "", dateOfBirth: "", fatherName: "", panNumber: "", aadhaarNumber: "",
      occupation: "", employer: "", designation: "", monthlyIncome: "", address: "",
      cibilScore: "", existingLoans: "", emiObligations: "", creditHistoryYears: "", previousLoanDefaults: "", numberOfDependents: "",
      loanType: "", loanAmount: "", tenureMonths: "",
    });
    setDocStatus(REQUIRED_DOCS.reduce((acc, doc) => ({ ...acc, [doc.key]: "idle" }), {}));
    setUploadedFiles({});
    setApplicationId(null);
    setSubmissionComplete(false);
    setStep(1);
  };

  /* =========================================================
     UPDATED WIZARD STEPS
  ========================================================= */
  const steps = [
    { num: 1, title: "Application Details" },
    { num: 2, title: "Documents" },
    { num: 3, title: "Review & Submit" },
  ];

  /* =========================================================
     RENDER: SUCCESS & PROCESSING SCREENS
  ========================================================= */
  if (submissionComplete && isClientApplication) {
    return (
      <div className="min-h-screen bg-banking-background flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl bg-banking-card border border-border rounded-xl shadow-sm p-6 sm:p-10 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-banking-success" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Application Submitted Successfully</h1>
          <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg mx-auto">
            Your loan application and documents have been submitted successfully. Our AI-assisted processing system will analyze your application.
          </p>
          <button
            type="button"
            onClick={handleStartAnotherApplication}
            className="mt-7 w-full sm:w-auto bg-banking-primary hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors min-h-[46px]"
          >
            Start Another Application
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    const pipelineSteps = PIPELINE_STAGES.map((stage) => ({
      key: stage.key,
      label: stage.label,
      status: processingProgress >= stage.threshold ? "complete" : processingProgress > stage.threshold - 15 ? "active" : "idle",
    }));

    return (
      <div className="min-h-screen bg-banking-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto mt-4 sm:mt-10">
          <div className="bg-banking-card border border-border p-6 sm:p-10 rounded-xl shadow-sm text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 rounded-full bg-banking-softBlue flex items-center justify-center">
              <div className="w-6 h-6 sm:w-7 sm:h-7 border-[3px] border-banking-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">Analyzing Application</h2>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
              <div className="bg-banking-primary h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(processingProgress, 100)}%` }} />
            </div>
            <div className="text-sm font-semibold text-banking-primary mb-6">
              {Math.min(processingProgress, 100)}% Complete
            </div>
            <div className="max-w-md mx-auto text-left">
              <ProcessingStatus steps={pipelineSteps} orientation="vertical" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN APPLICATION UI
  ========================================================= */
  return (
    <div className="min-h-screen bg-banking-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {isClientApplication && (
          <div className="mb-6 bg-banking-softBlue border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center shrink-0">
              <ShieldCheck size={18} className="text-banking-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Secure Loan Application</p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Complete the steps below to submit your loan application securely.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
            {isClientApplication ? "Start Your Loan Application" : "File New Application"}
          </h1>
        </div>

        {/* STEPPER */}
        <div className="mb-6 sm:mb-8">
          <div className="hidden sm:flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-light -z-10" />
            {steps.map((currentStep) => (
              <div key={currentStep.num} className="flex flex-col items-center bg-banking-background px-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${
                    step > currentStep.num
                      ? "bg-banking-success border-banking-success text-white"
                      : step === currentStep.num
                        ? "bg-banking-primary border-banking-primary text-white"
                        : "bg-banking-card border-border text-text-muted"
                  }`}
                >
                  {step > currentStep.num ? <Check size={20} /> : currentStep.num}
                </div>
                <span className={`text-sm mt-2 font-medium ${step >= currentStep.num ? "text-text-primary" : "text-text-muted"}`}>
                  {currentStep.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION WIZARD CARDS */}
        <div className="bg-banking-card border border-border rounded-lg shadow-sm">
          <div className="p-4 sm:p-8 min-h-[400px]">
            {/* STEP 1: COMBINED APPLICANT & LOAN DETAILS */}
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in duration-300">
                {/* A. Applicant Details */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary border-b border-border-light pb-4 mb-6">
                    A. Applicant Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <InputField label="Full Name" name="fullName" placeholder="e.g., Rahul Sharma" value={formData.fullName} onChange={handleInputChange} required />
                    <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required />
                    <InputField label="Father's Name" name="fatherName" placeholder="e.g., Bikram Sharma" value={formData.fatherName} onChange={handleInputChange} required />
                    <InputField label="PAN Number" name="panNumber" placeholder="e.g., ABCDE1234F" value={formData.panNumber} onChange={handleInputChange} required />
                    <InputField label="Aadhaar Number" name="aadhaarNumber" placeholder="[Aadhaar Redacted]" value={formData.aadhaarNumber} onChange={handleInputChange} required />
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-text-primary mb-1">Residential Address <span className="text-banking-error">*</span></label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 sm:py-2 border border-border rounded-md focus:ring-2 focus:ring-banking-primary focus:outline-none text-sm text-text-primary bg-white"
                        rows="3"
                        placeholder="e.g., Mumbai"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* B. Employment Details */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary border-b border-border-light pb-4 mb-6">
                    B. Employment & Loan Requirements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <InputField label="Occupation" name="occupation" placeholder="e.g., Software Engineer" value={formData.occupation} onChange={handleInputChange} required />
                    <InputField label="Employer" name="employer" placeholder="e.g., Infosys" value={formData.employer} onChange={handleInputChange} required />
                    <InputField label="Designation" name="designation" placeholder="e.g., Software Engineer" value={formData.designation} onChange={handleInputChange} required />
                    <InputField label="Monthly Income (₹)" name="monthlyIncome" type="number" placeholder="e.g., 68000" value={formData.monthlyIncome} onChange={handleInputChange} required />
                    
                    <div className="col-span-1 md:col-span-2 mt-2">
                      <label className="block text-sm font-medium text-text-primary mb-1">Loan Type <span className="text-banking-error">*</span></label>
                      <select
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 sm:py-2 border border-border rounded-md focus:ring-2 focus:ring-banking-primary focus:outline-none text-sm text-text-primary bg-white"
                        required
                      >
                        <option value="">Select a loan type...</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Home Loan">Home Loan</option>
                        <option value="Business Loan">Business Loan</option>
                      </select>
                    </div>

                    {formData.loanType && (
                      <>
                        <InputField label="Requested Amount (₹)" name="loanAmount" type="number" placeholder="e.g., 500000" value={formData.loanAmount} onChange={handleInputChange} required />
                        <InputField label="Tenure (Months)" name="tenureMonths" type="number" placeholder="e.g., 60" value={formData.tenureMonths} onChange={handleInputChange} required />
                      </>
                    )}
                  </div>
                </div>

                {/* C. Financial Details (NEW) */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary border-b border-border-light pb-4 mb-6">
                    C. Financial Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <InputField label="CIBIL Score" name="cibilScore" type="number" placeholder="e.g., 780" value={formData.cibilScore} onChange={handleInputChange} />
                    <InputField label="Existing Loans" name="existingLoans" type="number" placeholder="e.g., 1" value={formData.existingLoans} onChange={handleInputChange} />
                    <InputField label="Monthly EMI Obligations (₹)" name="emiObligations" type="number" placeholder="e.g., 12000" value={formData.emiObligations} onChange={handleInputChange} />
                    <InputField label="Credit History (Years)" name="creditHistoryYears" type="number" placeholder="e.g., 5" value={formData.creditHistoryYears} onChange={handleInputChange} />
                    <InputField label="Previous Defaults" name="previousLoanDefaults" type="number" placeholder="e.g., 0" value={formData.previousLoanDefaults} onChange={handleInputChange} />
                    <InputField label="Number of Dependents" name="numberOfDependents" type="number" placeholder="e.g., 2" value={formData.numberOfDependents} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DOCUMENTS */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-border-light pb-4 flex-wrap gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary">2. Document Upload</h2>
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">
                    {completedDocs}/{REQUIRED_DOCS.length} Required Documents Ready
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {REQUIRED_DOCS.map((doc) => (
                    <UploadCard key={doc.key} docType={doc.label} required onStatusChange={handleDocStatusChange} />
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & SUBMIT */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary border-b border-border-light pb-4">
                  3. Review & Submit
                </h2>
                <div className="bg-banking-background p-4 sm:p-6 rounded-lg border border-border-light">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <span className="text-text-secondary block mb-1">Applicant Name</span>
                      <span className="font-semibold text-text-primary">{formData.fullName || "Not Provided"}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary block mb-1">PAN Number</span>
                      <span className="font-semibold text-text-primary">{formData.panNumber || "Not Provided"}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary block mb-1">Loan Type</span>
                      <span className="font-semibold text-text-primary">{formData.loanType || "Not Provided"}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary block mb-1">Requested Amount</span>
                      <span className="font-semibold text-text-primary">
                        {formData.loanAmount ? `₹${Number(formData.loanAmount).toLocaleString()}` : "Not Provided"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-primary">Documents</h4>
                  {REQUIRED_DOCS.map((document) => (
                    <div key={document.key} className="flex items-center justify-between p-3 border border-border-light rounded-md bg-white">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText size={18} className="text-text-secondary shrink-0" />
                        <span className="text-sm font-medium truncate">{document.label}</span>
                      </div>
                      {docStatus[document.key] === "complete" ? (
                        <span className="text-xs font-medium text-banking-success bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1">
                          <Check size={12} /> Ready
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-banking-warning bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                          Pending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER NAVIGATION */}
          <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-border-light bg-gray-50 flex justify-between rounded-b-lg gap-3">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1 || isUploadingDocs}
              className={`px-4 sm:px-5 py-3 sm:py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors min-h-[46px] ${
                step === 1 || isUploadingDocs
                  ? "opacity-50 cursor-not-allowed text-text-muted"
                  : "text-text-primary bg-white border border-border hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={18} /> <span className="hidden sm:inline">Back</span>
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={saveTextDataAndContinue}
                disabled={isSavingText}
                className="bg-banking-primary hover:bg-blue-700 text-white px-4 sm:px-5 py-3 sm:py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors min-h-[46px]"
              >
                {isSavingText ? <Loader2 size={18} className="animate-spin" /> : "Next Step"}
                {!isSavingText && <ChevronRight size={18} />}
              </button>
            ) : step === 2 ? (
              <button
                type="button"
                onClick={uploadDocumentsAndContinue}
                disabled={!allDocsComplete || isUploadingDocs}
                className="bg-banking-primary hover:bg-blue-700 text-white px-4 sm:px-5 py-3 sm:py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors min-h-[46px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingDocs ? <Loader2 size={18} className="animate-spin" /> : "Next Step"}
                {!isUploadingDocs && <ChevronRight size={18} />}
              </button>
            ) : (
              <button
                type="button"
                onClick={startProcessing}
                disabled={isProcessing}
                className="bg-banking-success hover:bg-green-700 text-white px-5 sm:px-6 py-3 sm:py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors min-h-[46px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Application <Check size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   REUSABLE INPUT FIELD
========================================================= */
const InputField = ({ label, type = "text", placeholder, name, value, onChange, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1">{label}{required && <span className="text-banking-error"> *</span>}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 sm:py-2 border border-border rounded-md focus:ring-2 focus:ring-banking-primary focus:outline-none text-sm text-text-primary bg-white"
      />
    </div>
  );
};

export default NewApplication;