'use client';

import React from 'react';
import { Users, Target, Clock, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import { DocumentOverviewData } from '@/lib/types';

interface OverviewTabProps {
  overview: DocumentOverviewData | null;
  pageCount: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ overview, pageCount }) => {
  if (!overview) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Generating document overview...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* What this document is */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-amber-600" />
          <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">What this document is</h3>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">{overview.overview}</p>
      </div>

      {/* Grid of Key Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Who is involved */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Who is involved</h4>
          </div>
          <ul className="space-y-2">
            {overview.parties && overview.parties.length > 0 ? (
              overview.parties.map((party, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{party}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 italic">Not specified in document.</li>
            )}
          </ul>
        </div>

        {/* Main purpose */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Main purpose</h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{overview.mainPurpose || "Not specified in document."}</p>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Quick Summary</h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">{overview.summary}</p>

        {/* Terms Table */}
        <div className="border border-slate-100 rounded-lg overflow-hidden text-xs">
          <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-700 border-b border-slate-100">
            Key Governance Terms
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-500 font-medium">Duration / Term</span>
              <span className="text-slate-800 font-semibold">{overview.duration || "Not found in the document."}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-500 font-medium">Governing Law</span>
              <span className="text-slate-800 font-semibold">{overview.governingLaw || "Not found in the document."}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-500 font-medium">Length</span>
              <span className="text-slate-800 font-semibold">{pageCount} Page(s)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
