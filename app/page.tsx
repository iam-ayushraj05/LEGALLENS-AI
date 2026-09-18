'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { LegalDisclaimer } from '@/components/layout/LegalDisclaimer';
import { UploadModal } from '@/components/dashboard/UploadModal';
import { HeroVisual } from '@/components/landing/HeroVisual';
import { DEMO_DOCUMENT_ID } from '@/lib/services/demoData';
import {
  FileText, Bot, BookOpen, GitCompare, CheckSquare, Briefcase,
  ShieldCheck, ArrowRight, Play, CheckCircle2, Search, Upload, Compass
} from 'lucide-react';

export default function LandingPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-800" aria-labelledby="hero-title">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950 pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 text-center relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-amber-400 text-xs font-semibold shadow-inner">
              <ShieldCheck className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Document-grounded answers &bull; Source citations &bull; Built for informed next steps</span>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 id="hero-title" className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Understand the fine print.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Make informed next steps.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                AI-powered document understanding that helps you find important clauses, obligations, deadlines, and questions worth asking.
              </p>
            </div>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                aria-label="Upload and analyze a legal document"
              >
                <FileText className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
                <span>Analyze a Document</span>
              </button>

              <Link
                href={`/documents/${DEMO_DOCUMENT_ID}`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
                aria-label="Try interactive demo with sample employment agreement"
              >
                <Play className="w-4 h-4 text-amber-400 fill-current" aria-hidden="true" />
                <span>Try Demo</span>
              </Link>
            </div>

            {/* Hero Realistic Product Preview Component */}
            <div className="pt-8">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* How It Works (Section 7) */}
        <section className="py-20 bg-slate-950 border-b border-slate-800" aria-labelledby="how-it-works-title">
          <div className="max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Simple 3-Step Process
              </span>
              <h2 id="how-it-works-title" className="text-3xl font-bold text-white">How LegalLens AI Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
                <span className="text-3xl font-extrabold text-amber-400/40" aria-hidden="true">01</span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" aria-hidden="true" /> Upload
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Add your contract, agreement, policy, or legal document (PDF, DOCX, TXT up to 10MB).
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
                <span className="text-3xl font-extrabold text-amber-400/40" aria-hidden="true">02</span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" aria-hidden="true" /> Understand
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  LegalLens identifies important provisions, obligations, and dates, explaining them in plain English.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
                <span className="text-3xl font-extrabold text-amber-400/40" aria-hidden="true">03</span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" aria-hidden="true" /> Explore
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ask questions, inspect source citations, compare versions, and generate lawyer preparation briefs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section (Section 8) */}
        <section className="py-20 bg-slate-900/60 border-b border-slate-800" aria-labelledby="capabilities-title">
          <div className="max-w-7xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Core Capabilities
              </span>
              <h2 id="capabilities-title" className="text-3xl font-bold text-white">Built for clarity, safety, and evidence.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-white">Plain-English Summary</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Turn dense legal language into understandable explanations with key governance terms.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-white">Ask Your Document</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ask questions and receive evidence-grounded answers with clickable page and section citations.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-white">Important Clauses</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Find payment, termination, confidentiality, IP, liability, and renewal provisions instantly.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  <CheckSquare className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-white">Obligations & Deadlines</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track exact party responsibilities, due dates, notice windows, and cure periods on a timeline.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  <GitCompare className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-white">Compare Versions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Analyze what changed between two versions with side-by-side red/green diff cards.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-white">Lawyer Prep</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate structured consultation briefs with key facts, provisions, attorney questions, and records to bring.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Section (Section 9) */}
        <section className="py-16 bg-slate-950 border-b border-slate-800" aria-labelledby="safety-title">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 id="safety-title" className="text-2xl font-bold text-white">AI assistance, not legal advice.</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
              LegalLens helps you understand documents and prepare informed questions. It does not provide individualized legal advice or replace a qualified legal professional.
            </p>
            <p className="text-xs text-amber-400 font-semibold">
              Always verify important information against the original document.
            </p>
          </div>
        </section>
      </main>

      <LegalDisclaimer variant="footer" />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
