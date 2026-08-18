import React, { useRef, useState } from 'react';
import { FileText, UploadCloud, CheckCircle2, X, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';

// Realistic staged messages per the workflow diagram (OCR -> Classification -> GenAI Extraction -> Validation)
const STAGES = [
  { at: 0, label: 'Uploading your document...', sub: 'Securely transferring your file' },
  { at: 30, label: 'Document uploaded', sub: 'Preparing for processing', complete: 'upload' },
  { at: 45, label: 'Reading document contents...', sub: 'Running OCR / text extraction' },
  { at: 65, label: 'Extracting important information...', sub: 'Identifying applicant & financial details' },
  { at: 85, label: 'Checking extracted information...', sub: 'Validating format & consistency' },
  { at: 100, label: 'Document analysis completed', sub: 'Ready for review', complete: 'analysis' },
];

const formatSize = (bytes) => {
  if (!bytes) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

/**
 * docType: display label (e.g. "Salary Slip")
 * required: boolean
 * onStatusChange(docType, status): reports 'idle' | 'uploaded' | 'complete' up to parent for progress tracking
 */
const UploadCard = ({ docType, required = true, onStatusChange }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState('idle'); // idle | working | done | failed

const runSimulation = (selectedFile) => {
    setState('working');
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      // slightly randomized increments for a realistic feel
      p += Math.floor(Math.random() * 10) + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        setProgress(100);
        setState('done');
        // CRITICAL UPDATE: Pass the selectedFile back to NewApplication.jsx
        onStatusChange?.(docType, 'complete', selectedFile);
      } else {
        setProgress(p);
      }
    }, 280);
  };

  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    onStatusChange?.(docType, 'uploaded');
    runSimulation(selected); // Pass the file into the simulation function
  };

  const handleInputChange = (e) => handleFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    setFile(null);
    setProgress(0);
    setState('idle');
    onStatusChange?.(docType, 'idle');
    if (inputRef.current) inputRef.current.value = '';
  };

  const currentStage = [...STAGES].reverse().find((s) => progress >= s.at) || STAGES[0];

  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        state === 'idle' ? 'border-dashed border-border-light bg-banking-softBlue/10' : 'border-border bg-white'
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
          {docType}
          {required && <span className="text-banking-error text-xs">*</span>}
        </span>
        {state === 'done' && (
          <span className="text-xs font-medium text-banking-success bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1 shrink-0">
            <CheckCircle2 size={12} /> Complete
          </span>
        )}
      </div>

      {state === 'idle' && (
        <div className="flex flex-col items-center justify-center text-center py-6 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <UploadCloud size={28} className="text-banking-primary mb-2" />
          <p className="text-xs text-text-secondary mb-3">Tap to select, or drag & drop (PDF, JPG, PNG · max 10MB)</p>
          <button
            type="button"
            className="bg-white border border-border text-text-primary px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-50 min-h-[40px]"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            Browse Files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {(state === 'working' || state === 'done') && file && (
        <div className="mt-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-md bg-banking-softBlue flex items-center justify-center shrink-0">
              <FileText size={18} className="text-banking-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary truncate" title={file.name}>{file.name}</p>
              <p className="text-xs text-text-muted">{formatSize(file.size)}</p>
            </div>
            {state === 'done' ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-xs font-medium text-banking-primary hover:underline"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label={`Remove ${file.name}`}
                  className="text-text-muted hover:text-banking-error p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <span className="text-xs font-medium text-banking-primary shrink-0">{progress}%</span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${state === 'done' ? 'bg-banking-success' : 'bg-banking-primary'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Contextual microcopy per stage */}
          <div className="flex items-center gap-1.5 text-xs">
            {state === 'done' ? (
              <CheckCircle2 size={13} className="text-banking-success shrink-0" />
            ) : (
              <Loader2 size={13} className="text-banking-primary animate-spin shrink-0" />
            )}
            <span className={state === 'done' ? 'text-banking-success font-medium' : 'text-text-secondary'}>
              {currentStage.label}
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {state === 'failed' && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-md p-3">
          <span className="text-xs text-banking-error flex items-center gap-1.5">
            <AlertCircle size={14} /> Unable to process this document.
          </span>
          <button onClick={() => runSimulation()} className="text-xs font-medium text-banking-primary flex items-center gap-1">
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
