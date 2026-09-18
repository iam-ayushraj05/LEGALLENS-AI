'use client';

import React from 'react';
import { CheckCircle2, Clock, ArrowUpRight, UserCheck } from 'lucide-react';
import { ExtractedObligation } from '@/lib/types';

interface ObligationsTabProps {
  obligations: ExtractedObligation[];
  onCitationClick?: (pageNumber: number, section?: string) => void;
}

export const ObligationsTab: React.FC<ObligationsTabProps> = ({ obligations, onCitationClick }) => {
  if (!obligations || obligations.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No specific obligations identified in this document.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {obligations.map((ob, idx) => (
          <div
            key={ob.id || idx}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <UserCheck className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    {ob.party || 'Obligation'}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-sm">{ob.action}</h4>
                </div>
              </div>

              <button
                onClick={() => onCitationClick && onCitationClick(ob.pageNumber, ob.section)}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900 border border-slate-200 transition-colors shrink-0"
              >
                <span>Page {ob.pageNumber}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
              {ob.deadline && (
                <div className="flex items-center gap-1 font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Deadline: {ob.deadline}</span>
                </div>
              )}

              {ob.frequency && (
                <div className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  Frequency: {ob.frequency}
                </div>
              )}

              {ob.conditions && (
                <div className="text-slate-500 italic">
                  Condition: {ob.conditions}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
