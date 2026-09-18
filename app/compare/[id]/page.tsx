'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { LegalDisclaimer } from '@/components/layout/LegalDisclaimer';
import { GitCompare, ArrowLeft, Filter, AlertTriangle, PlusCircle, MinusCircle, Edit3 } from 'lucide-react';

export default function ComparisonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/compare/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.comparison) setData(json.comparison);
      })
      .catch(err => console.error("Comparison load error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-400">
          Loading document comparison engine...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-xs">
          <p>Comparison data not found.</p>
          <button onClick={() => router.push('/compare')} className="px-4 py-2 bg-slate-800 rounded">
            Back to Select Documents
          </button>
        </div>
      </div>
    );
  }

  const { title, overview, docA, docB, changes } = data;
  const categories = ['All', ...Array.from(new Set(changes.map((c: any) => c.category)))];

  const filteredChanges = selectedCategory === 'All'
    ? changes
    : changes.filter((c: any) => c.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <LegalDisclaimer variant="banner" />

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/compare')}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-bold text-base text-white">{title}</h1>
            <p className="text-xs text-slate-400">Side-by-side legal diff & semantic change analysis</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Overview Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-2">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
            What Changed Summary
          </span>
          <p className="text-sm text-slate-300 leading-relaxed pt-1">{overview}</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Change Cards Grid */}
        <div className="space-y-4">
          {filteredChanges.map((item: any, idx: number) => {
            const isAdded = item.changeType === 'added';
            const isRemoved = item.changeType === 'removed';

            return (
              <div
                key={item.id || idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      isAdded
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : isRemoved
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isAdded ? <PlusCircle className="w-3.5 h-3.5" /> : isRemoved ? <MinusCircle className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                      <span>{item.category} ({item.changeType})</span>
                    </span>
                  </div>
                  {item.location && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      {item.location}
                    </span>
                  )}
                </div>

                {/* Explanation */}
                <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                  {item.explanation}
                </p>

                {/* Side-by-Side Diff Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
                  {/* OLD */}
                  <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 space-y-1">
                    <span className="font-sans text-[10px] font-bold text-red-400 uppercase tracking-widest block">
                      OLD (Original)
                    </span>
                    <p className="text-red-200/90 leading-relaxed">
                      {item.oldText ? `"${item.oldText}"` : <span className="text-slate-500 italic font-sans">[No previous clause text]</span>}
                    </p>
                  </div>

                  {/* NEW */}
                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 space-y-1">
                    <span className="font-sans text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                      NEW (Revised)
                    </span>
                    <p className="text-emerald-200/90 leading-relaxed">
                      {item.newText ? `"${item.newText}"` : <span className="text-slate-500 italic font-sans">[Clause removed in revision]</span>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
