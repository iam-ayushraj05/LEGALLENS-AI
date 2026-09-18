'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { DEMO_DOCUMENT_ID, DEMO_COMPARISON_DOC_ID } from '@/lib/services/demoData';
import { GitCompare, ArrowRight, Loader2 } from 'lucide-react';

function CompareSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preDocA = searchParams?.get('docA');

  const [documents, setDocuments] = useState<any[]>([]);
  const [docA, setDocA] = useState<string>(preDocA || DEMO_DOCUMENT_ID);
  const [docB, setDocB] = useState<string>(DEMO_COMPARISON_DOC_ID);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch(() => {});
  }, []);

  const handleStartCompare = async () => {
    if (!docA || !docB) return;
    setLoading(true);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docAId: docA, docBId: docB })
      });

      const data = await res.json();
      if (data.comparisonId) {
        router.push(`/compare/${data.comparisonId}`);
      }
    } catch (err) {
      console.error("Comparison initiation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 mx-auto flex items-center justify-center font-bold">
          <GitCompare className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold">Compare Legal Documents</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Select two document versions to analyze additions, deletions, payment shifts, and legal obligation changes.
        </p>
      </div>

      {/* Dual Document Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* Document A Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
            Document A (Original Version)
          </label>
          <select
            value={docA}
            onChange={(e) => setDocA(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value={DEMO_DOCUMENT_ID}>Freelance Services Agreement v1 (Demo)</option>
            {documents.map(d => (
              <option key={d.id} value={d.id}>{d.title} ({d.fileType.toUpperCase()})</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">Serves as the baseline original agreement text.</p>
        </div>

        {/* Document B Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Document B (Revised Version)
          </label>
          <select
            value={docB}
            onChange={(e) => setDocB(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-400"
          >
            <option value={DEMO_COMPARISON_DOC_ID}>Freelance Services Agreement v2 - Revised (Demo)</option>
            {documents.map(d => (
              <option key={d.id} value={d.id}>{d.title} ({d.fileType.toUpperCase()})</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">Serves as the updated or proposed revised draft.</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center pt-4">
        <button
          onClick={handleStartCompare}
          disabled={loading}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Comparison & Diff Engine...</span>
            </>
          ) : (
            <>
              <span>Compare Versions Now</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </main>
  );
}

export default function CompareSelectionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Loading comparison page...
        </div>
      }>
        <CompareSelectionContent />
      </Suspense>
    </div>
  );
}
