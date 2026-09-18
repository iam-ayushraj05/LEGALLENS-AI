'use client';

import React, { useState } from 'react';
import { FileSearch, HelpCircle, AlertCircle, ArrowUpRight, Filter } from 'lucide-react';
import { ExtractedClause } from '@/lib/types';

interface ClausesTabProps {
  clauses: ExtractedClause[];
  onCitationClick?: (pageNumber: number, section?: string, textSnippet?: string) => void;
}

export const ClausesTab: React.FC<ClausesTabProps> = ({ clauses, onCitationClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!clauses || clauses.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No specific clause categories extracted from this document.
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(clauses.map(c => c.type)))];

  const filtered = selectedCategory === 'All'
    ? clauses
    : clauses.filter(c => c.type === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clause Cards List */}
      <div className="space-y-4">
        {filtered.map((clause, idx) => (
          <div
            key={clause.id || idx}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-amber-300 transition-all group"
          >
            {/* Title & Source Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-widest px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                  {clause.type}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1.5">{clause.title}</h3>
              </div>

              {/* Source Citation Badge */}
              <button
                onClick={() => onCitationClick && onCitationClick(clause.pageNumber, clause.section, clause.originalText)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 transition-colors shrink-0"
                title="Click to jump to source text in viewer"
              >
                <span>Page {clause.pageNumber} &bull; {clause.section || 'General'}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-amber-700" />
              </button>
            </div>

            {/* 4-Part Legal Understanding UX */}
            <div className="space-y-3.5 text-xs">
              {/* 1. Original Excerpt */}
              <div className="bg-slate-50 border-l-2 border-slate-300 p-3 rounded-r-lg font-mono text-[11px] text-slate-700 leading-relaxed overflow-x-auto">
                <span className="text-[10px] font-semibold uppercase text-slate-400 block font-sans mb-1">What the document says:</span>
                "{clause.originalText}"
              </div>

              {/* 2. In Plain English */}
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">In plain English:</span>
                <p className="text-slate-600 leading-relaxed">{clause.summary}</p>
              </div>

              {/* 3. What it may require */}
              {clause.requires && (
                <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-lg text-emerald-900">
                  <span className="font-bold block text-emerald-950 mb-0.5">What it may require:</span>
                  <p className="leading-relaxed text-emerald-900">{clause.requires}</p>
                </div>
              )}

              {/* 4. What to check */}
              {clause.toCheck && (
                <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-lg text-amber-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-950 mb-0.5">What to check:</span>
                    <p className="leading-relaxed">{clause.toCheck}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
