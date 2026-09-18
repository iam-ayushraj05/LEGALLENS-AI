'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (docId: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress states
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Uploading document...",
    "Extracting text & preserving pages...",
    "Identifying sections & chunking...",
    "Finding important clauses & terms...",
    "Building plain-English summary & checklist..."
  ];

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile: File): boolean => {
    setError(null);
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'docx', 'txt'];
    if (!ext || !validExts.includes(ext)) {
      setError("We couldn't process this file format. Please select a PDF, DOCX, or TXT file.");
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please upload a smaller document.");
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setStepIndex(0);

    // Step progress interval simulation aligned with actual API calls
    const timer1 = setTimeout(() => setStepIndex(1), 800);
    const timer2 = setTimeout(() => setStepIndex(2), 1800);
    const timer3 = setTimeout(() => setStepIndex(3), 3200);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      });

      setStepIndex(4);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload document.");
      }

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
        if (onSuccess) {
          onSuccess(data.documentId);
        } else {
          router.push(`/documents/${data.documentId}`);
        }
      }, 800);

    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsProcessing(false);
      setError(err.message || "We couldn't reliably extract text from this document. Try another PDF or upload a DOCX version.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <h3 className="text-xl font-bold text-slate-900 mb-1">Analyze Document</h3>
        <p className="text-xs text-slate-500 mb-6">
          Upload a contract, agreement, or legal policy (PDF, DOCX, TXT up to 10MB).
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!isProcessing ? (
          <div>
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-amber-500 bg-amber-50/50'
                  : file
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-amber-400 bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-slate-800 text-sm mb-1">{file.name}</span>
                  <span className="text-xs text-slate-500 mb-3">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready for analysis
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-slate-400 hover:text-red-500 underline"
                  >
                    Choose another file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PDF, DOCX, or TXT (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!file}
                onClick={handleUpload}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors"
              >
                Start Analysis
              </button>
            </div>
          </div>
        ) : (
          /* Processing Progress State */
          <div className="py-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-200 flex items-center justify-center text-amber-600 relative">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {steps.map((st, idx) => {
                const isCurrent = idx === stepIndex;
                const isDone = idx < stepIndex;

                return (
                  <div key={st} className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        isCurrent
                          ? 'font-semibold text-slate-900'
                          : isDone
                          ? 'text-slate-600 font-medium'
                          : 'text-slate-400'
                      }`}
                    >
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
