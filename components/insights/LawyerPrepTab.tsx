'use client';

import React from 'react';
import { Briefcase, FileText, HelpCircle, FolderCheck, Printer, ArrowUpRight } from 'lucide-react';
import { LawyerPrepData } from '@/lib/types';
import { LegalDisclaimer } from '@/components/layout/LegalDisclaimer';

interface LawyerPrepTabProps {
  lawyerPrep: LawyerPrepData | null;
  onCitationClick?: (pageNumber: number, section?: string) => void;
}

export const LawyerPrepTab: React.FC<LawyerPrepTabProps> = ({ lawyerPrep, onCitationClick }) => {
  if (!lawyerPrep) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Generating consultation preparation report...
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Prepare for a Legal Consultation</h3>
          </div>
          <p className="text-xs text-slate-300">
            Use this structured brief to maximize efficiency when speaking with a attorney or legal counsel.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Export Brief</span>
        </button>
      </div>

      <LegalDisclaimer variant="inline" />

      {/* Key Facts */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">1. Key Facts & Summary</h4>
        </div>
        <ul className="space-y-2">
          {lawyerPrep.keyFacts.map((fact, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span className="leading-relaxed">{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Important Provisions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Briefcase className="w-4 h-4 text-amber-600" />
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">2. Important Provisions to Review</h4>
        </div>
        <div className="space-y-2.5">
          {lawyerPrep.provisions.map((prov, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">{prov.title}</span>
                <p className="text-slate-600 italic">"{prov.excerpt}"</p>
              </div>

              {prov.pageNumber && (
                <button
                  onClick={() => onCitationClick && onCitationClick(prov.pageNumber, prov.section)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100 shrink-0"
                >
                  <span>Page {prov.pageNumber}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Questions to Ask */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">3. Suggested Questions for Your Lawyer</h4>
        </div>
        <div className="space-y-2">
          {lawyerPrep.questionsToAsk.map((q, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-950 font-medium">
              "{q}"
            </div>
          ))}
        </div>
      </div>

      {/* Information to Bring */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <FolderCheck className="w-4 h-4 text-purple-600" />
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">4. Recommended Information to Bring</h4>
        </div>
        <ul className="space-y-2">
          {lawyerPrep.infoToBring.map((info, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
              <span>{info}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
