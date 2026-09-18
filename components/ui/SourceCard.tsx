'use client';

import React from 'react';
import { ArrowUpRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { Citation } from '@/lib/types';

interface SourceCardProps {
  citation: Citation;
  onClick?: () => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({ citation, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-slate-950 border border-amber-400/30 hover:border-amber-400 rounded-xl p-3.5 shadow-md transition-all cursor-pointer group space-y-2"
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
          <BookOpen className="w-3 h-3" /> SOURCE EVIDENCE
        </span>
        <span className="font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Page {citation.pageNumber} {citation.section ? `&bull; ${citation.section}` : ''}
        </span>
      </div>

      <p className="text-xs font-mono text-slate-300 italic bg-slate-900/60 p-2.5 rounded border border-slate-800/80 leading-relaxed line-clamp-2">
        "{citation.excerpt}"
      </p>

      <div className="flex items-center justify-end text-[11px] font-semibold text-amber-400 group-hover:underline pt-0.5">
        <span className="flex items-center gap-1">
          View in document <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};
