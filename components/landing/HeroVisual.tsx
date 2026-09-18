'use client';

import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, FileText, Sparkles } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState(true);

  return (
    <div className="relative max-w-4xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-left font-sans">
      {/* Top Mac-style bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-slate-400 text-[11px] font-mono ml-2">Executive_Employment_Agreement_2026.pdf</span>
        </div>
        <div className="flex items-center gap-2 text-amber-400 text-[11px] font-semibold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
          <Sparkles className="w-3 h-3" />
          <span>LegalLens Intelligence Workspace</span>
        </div>
      </div>

      {/* Grid Layout: Document Left, AI Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
        {/* Document Content Left (Cols 1-7) */}
        <div className="md:col-span-7 p-6 bg-slate-950/60 border-r border-slate-800 font-serif text-xs leading-relaxed text-slate-300 space-y-4">
          <div className="flex items-center justify-between font-sans text-[10px] text-slate-400 border-b border-slate-800 pb-2 uppercase tracking-widest font-semibold">
            <span>DOCUMENT PAGE 8 OF 14</span>
            <span>SECTION 9 — TERMINATION</span>
          </div>

          <p className="font-sans text-[11px] text-slate-400">
            9.1 Termination for Cause. Either party may terminate this Agreement immediately upon written notice...
          </p>

          <div className={`p-3 rounded-lg border transition-all duration-500 font-sans ${
            activeHighlight
              ? 'bg-amber-400/15 border-amber-400/60 text-amber-100 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              9.2 Termination for Convenience:
            </span>
            "Either party may terminate this Agreement at any time by providing thirty (30) days' prior written notice to the other party."
          </div>

          <p className="font-sans text-[11px] text-slate-400">
            9.3 Effect of Termination. Upon expiration or earlier termination of this Agreement, Contractor shall return all company materials...
          </p>
        </div>

        {/* AI Insight Card Right (Cols 8-12) */}
        <div className="md:col-span-5 p-6 bg-slate-900/90 flex flex-col justify-center space-y-4">
          <div className="bg-slate-950 border border-amber-400/40 rounded-xl p-4 shadow-xl space-y-3 relative group">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                Extracted Clause
              </span>
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                Page 8 &bull; §9.2
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm">Termination Notice Period</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Requires 30 calendar days advance written notice to terminate the contract.
              </p>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-lg text-[11px] text-emerald-300">
              <span className="font-bold block text-emerald-400">What to check:</span>
              Confirm if 30 days provides sufficient lead time before deliverable handoff.
            </div>

            <button
              onClick={() => setActiveHighlight(!activeHighlight)}
              className="w-full py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <span>{activeHighlight ? 'Source Highlight Active' : 'Highlight Source Text'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
