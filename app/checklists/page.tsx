'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { LegalDisclaimer } from '@/components/layout/LegalDisclaimer';
import { ChecklistTab } from '@/components/insights/ChecklistTab';
import { DEMO_DOCUMENT_ID, DEMO_ANALYSIS_DATA } from '@/lib/services/demoData';
import { CheckSquare, ArrowRight, Play } from 'lucide-react';

export default function ChecklistsOverviewPage() {
  const [demoChecklist, setDemoChecklist] = useState(DEMO_ANALYSIS_DATA.checklist);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="border-b border-slate-800 pb-6 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <h1 className="text-2xl font-bold">Action Checklists</h1>
            </div>
            <p className="text-xs text-slate-400">
              Track contractual deadlines, required notifications, and pending obligations.
            </p>
          </div>

          <Link
            href={`/documents/${DEMO_DOCUMENT_ID}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold hover:bg-slate-800"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open Demo Contract</span>
          </Link>
        </div>

        {/* Demo Contract Action Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Active Contract
              </span>
              <h3 className="font-bold text-base text-white mt-1">Freelance Services Agreement v1</h3>
            </div>
            <Link
              href={`/documents/${DEMO_DOCUMENT_ID}`}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ChecklistTab documentId={DEMO_DOCUMENT_ID} checklist={demoChecklist} />
        </div>
      </main>
    </div>
  );
}
