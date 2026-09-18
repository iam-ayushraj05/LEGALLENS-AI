'use client';

import React from 'react';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { ExtractedDate } from '@/lib/types';

interface DatesTabProps {
  dates: ExtractedDate[];
  onCitationClick?: (pageNumber: number, section?: string) => void;
}

export const DatesTab: React.FC<DatesTabProps> = ({ dates, onCitationClick }) => {
  if (!dates || dates.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No explicit dates or timeline deadlines found in this document.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {dates.map((item, idx) => (
          <div key={item.id || idx} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center text-amber-700 shadow-sm">
              <Calendar className="w-3 h-3" />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-300 transition-all">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{item.title}</h4>
                </div>

                <button
                  onClick={() => onCitationClick && onCitationClick(item.pageNumber, item.section)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-900 border border-slate-200 transition-colors shrink-0"
                >
                  <span>Page {item.pageNumber}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="font-semibold text-amber-900 text-xs my-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{item.dateValue}</span>
              </div>

              <p className="text-xs font-mono bg-slate-50 p-2.5 rounded border border-slate-100 text-slate-600 leading-relaxed mt-2">
                "{item.sourceExcerpt}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
