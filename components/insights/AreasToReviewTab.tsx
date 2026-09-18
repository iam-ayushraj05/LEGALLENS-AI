'use client';

import React from 'react';
import { AlertOctagon, HelpCircle, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { ExtractedAreaToReview } from '@/lib/types';

interface AreasToReviewTabProps {
  areas: ExtractedAreaToReview[];
  onCitationClick?: (pageNumber: number, section?: string) => void;
}

export const AreasToReviewTab: React.FC<AreasToReviewTabProps> = ({ areas, onCitationClick }) => {
  if (!areas || areas.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No significant areas to review identified in this document.
      </div>
    );
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Potentially Significant':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <AlertOctagon className="w-4 h-4 text-red-600" />
        };
      case 'Unclear':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <HelpCircle className="w-4 h-4 text-purple-600" />
        };
      case 'Missing Information':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />
        };
      default:
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {areas.map((item, idx) => {
          const badge = getCategoryBadge(item.category);

          return (
            <div
              key={item.id || idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-amber-300 transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${badge.bg} border flex items-center gap-1.5 font-bold text-xs`}>
                    {badge.icon}
                    <span>{item.category}</span>
                  </span>
                </div>

                <button
                  onClick={() => onCitationClick && onCitationClick(item.pageNumber, item.section)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors shrink-0"
                >
                  <span>Page {item.pageNumber}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Finding & Why It Matters */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.finding}</h4>
                <div className="text-xs text-slate-600 space-y-2 mt-2">
                  <div>
                    <span className="font-semibold text-slate-800 block">Why it may matter:</span>
                    <p className="leading-relaxed">{item.whyItMatters}</p>
                  </div>

                  {/* Question to Consider */}
                  <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-lg text-amber-900 mt-2">
                    <span className="font-bold block text-amber-950 text-[11px] uppercase tracking-wider mb-0.5">
                      Question to consider:
                    </span>
                    <p className="font-medium text-xs">"{item.questionToConsider}"</p>
                  </div>

                  {item.sourceExcerpt && (
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100 font-mono text-[11px] text-slate-600 mt-2">
                      <span className="font-sans text-[10px] font-semibold text-slate-400 block mb-0.5 uppercase">Source Excerpt:</span>
                      "{item.sourceExcerpt}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
