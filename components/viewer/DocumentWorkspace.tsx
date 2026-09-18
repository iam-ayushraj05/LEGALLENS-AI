'use client';

import React, { useState, useRef } from 'react';
import {
  FileText, Search, BookOpen, Bot,
  Calendar, DollarSign, AlertTriangle, CheckSquare, Briefcase, GitCompare, ChevronRight, CheckCircle2
} from 'lucide-react';
import { OverviewTab } from '@/components/insights/OverviewTab';
import { ClausesTab } from '@/components/insights/ClausesTab';
import { ObligationsTab } from '@/components/insights/ObligationsTab';
import { DatesTab } from '@/components/insights/DatesTab';
import { PaymentsTab } from '@/components/insights/PaymentsTab';
import { AreasToReviewTab } from '@/components/insights/AreasToReviewTab';
import { AskTab } from '@/components/insights/AskTab';
import { ChecklistTab } from '@/components/insights/ChecklistTab';
import { LawyerPrepTab } from '@/components/insights/LawyerPrepTab';
import { LegalDisclaimer } from '@/components/layout/LegalDisclaimer';
import Link from 'next/link';

interface DocumentWorkspaceProps {
  data: any;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightText, setHighlightText] = useState<string | null>(null);
  const [targetPage, setTargetPage] = useState<number | null>(null);
  const [sourceFoundBanner, setSourceFoundBanner] = useState<string | null>(null);

  const documentViewerRef = useRef<HTMLDivElement>(null);

  const { document: doc, overview, clauses, obligations, dates, payments, areasToReview, checklist, lawyerPrep, chatMessages } = data;

  // Split raw text into pages for rendering
  const pages: string[] = doc.rawText
    ? doc.rawText.split(/\f|\n\n(?=SECTION \d+|ARTICLE \d+|\d+\.\s+[A-Z])/i)
    : ["Document content unavailable."];

  // The "Magic Moment" citation click handler
  const handleCitationClick = (pageNumber: number, section?: string, textSnippet?: string) => {
    setTargetPage(pageNumber);
    if (textSnippet) {
      setHighlightText(textSnippet.slice(0, 80));
    } else if (section) {
      setHighlightText(section);
    }

    setSourceFoundBanner(`Source found on Page ${pageNumber} ${section ? `· ${section}` : ''}`);

    // Scroll viewer to page element
    setTimeout(() => {
      const pageEl = document.getElementById(`doc-page-${pageNumber}`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    // Hide banner after 3 seconds
    setTimeout(() => {
      setSourceFoundBanner(null);
    }, 3500);
  };

  const tabs = [
    { id: 'Overview', label: 'Overview', icon: FileText },
    { id: 'Ask', label: 'Ask Document', icon: Bot },
    { id: 'Clauses', label: 'Clauses', icon: BookOpen, count: clauses?.length },
    { id: 'Obligations', label: 'Obligations', icon: CheckSquare, count: obligations?.length },
    { id: 'Dates', label: 'Dates', icon: Calendar, count: dates?.length },
    { id: 'Payments', label: 'Payments', icon: DollarSign, count: payments?.length },
    { id: 'AreasToReview', label: 'Areas to Review', icon: AlertTriangle, count: areasToReview?.length },
    { id: 'Checklist', label: 'Checklist', icon: CheckSquare, count: checklist?.length },
    { id: 'LawyerPrep', label: 'Lawyer Prep', icon: Briefcase }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Disclaimer Header */}
      <LegalDisclaimer variant="banner" />

      {/* Screen Reader Announcement Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {sourceFoundBanner || ''}
      </div>

      {/* Workspace Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0" aria-label={`File format: ${doc.fileType}`}>
            {doc.fileType.toUpperCase()}
          </div>
          <div className="truncate">
            <h1 className="font-bold text-sm text-white truncate">{doc.title}</h1>
            <p className="text-[11px] text-slate-400">
              {doc.pageCount} Page(s) &bull; Analyzed by LegalLens Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/compare?docA=${doc.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-400 transition-colors focus:ring-2 focus:ring-amber-400"
            aria-label="Compare this document with another version"
          >
            <GitCompare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Compare Version</span>
          </Link>
        </div>
      </div>

      {/* Main 3-Panel Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

        {/* LEFT PANEL: Document Navigation & Sections (Cols 1-3) */}
        <nav className="hidden lg:block lg:col-span-3 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto p-4 space-y-4" aria-label="Document Outline and Page Navigation">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Document Outline & Pages
          </div>

          <div className="space-y-1">
            {pages.map((_, idx) => {
              const pageNum = idx + 1;
              const isSelected = targetPage === pageNum;

              return (
                <button
                  key={pageNum}
                  onClick={() => handleCitationClick(pageNum)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-amber-400/15 border border-amber-400/40 text-amber-300'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label={`Jump to page ${pageNum}`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>Page {pageNum}</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-600" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Key Sections Identified
            </div>
            <div className="space-y-1 text-xs">
              {clauses?.slice(0, 6).map((c: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleCitationClick(c.pageNumber, c.section, c.originalText)}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800/80 text-slate-400 hover:text-amber-300 truncate transition-colors block"
                  aria-label={`Jump to clause: ${c.section || c.title}, Page ${c.pageNumber}`}
                >
                  {c.section || c.title}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* CENTER PANEL: Interactive Document Text Viewer (Cols 4-7) */}
        <section className="lg:col-span-4 bg-slate-950 flex flex-col border-r border-slate-800 overflow-hidden relative" aria-label="Legal Document Viewer">
          {/* Magic Moment "Source Found" Banner Indicator */}
          {sourceFoundBanner && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5 animate-bounce" role="status">
              <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-500" aria-hidden="true" />
              <span>{sourceFoundBanner}</span>
            </div>
          )}

          {/* Document Search Bar */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contract text (e.g. 'termination', 'payment')..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              aria-label="Search document text"
            />
          </div>

          {/* Scrollable Page Content Container */}
          <div ref={documentViewerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
            {pages.map((pageContent, idx) => {
              const pageNum = idx + 1;
              const isTargeted = targetPage === pageNum;

              return (
                <article
                  id={`doc-page-${pageNum}`}
                  key={pageNum}
                  className={`doc-page-container rounded-xl p-6 text-slate-900 text-xs font-serif leading-relaxed relative transition-all ${
                    isTargeted ? 'ring-2 ring-amber-400 shadow-xl' : ''
                  }`}
                  aria-label={`Document page ${pageNum}`}
                >
                  {/* Page Badge */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4 font-sans text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    <span>DOCUMENT PAGE {pageNum} OF {pages.length}</span>
                    <span>LegalLens Grounded Evidence</span>
                  </div>

                  {/* Render Page Paragraphs */}
                  <div className="space-y-3 whitespace-pre-wrap font-sans">
                    {pageContent.split('\n\n').map((para, pIdx) => {
                      const isMatchSnippet = highlightText && para.toLowerCase().includes(highlightText.toLowerCase());

                      return (
                        <p
                          key={pIdx}
                          className={`p-1.5 rounded transition-colors ${
                            isMatchSnippet ? 'citation-highlight-active' : ''
                          }`}
                        >
                          {para}
                        </p>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* RIGHT PANEL: AI Intelligence Suite (Cols 8-12) */}
        <section className="lg:col-span-5 bg-slate-900 flex flex-col overflow-hidden" aria-label="AI Document Intelligence Workspace">
          {/* Tabs Bar */}
          <div className="flex items-center gap-1 px-3 pt-3 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none" role="tablist" aria-label="Analysis categories">
            {tabs.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;

              return (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg text-xs font-semibold whitespace-nowrap border-t border-x transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-800 text-amber-400'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.label}</span>
                  {t.count !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Content */}
          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="flex-1 overflow-y-auto p-5 bg-slate-900 text-slate-100 focus:outline-none"
            tabIndex={0}
          >
            {activeTab === 'Overview' && (
              <OverviewTab overview={overview} pageCount={doc.pageCount} />
            )}
            {activeTab === 'Ask' && (
              <AskTab documentId={doc.id} initialMessages={chatMessages} onCitationClick={handleCitationClick} />
            )}
            {activeTab === 'Clauses' && (
              <ClausesTab clauses={clauses} onCitationClick={handleCitationClick} />
            )}
            {activeTab === 'Obligations' && (
              <ObligationsTab obligations={obligations} onCitationClick={handleCitationClick} />
            )}
            {activeTab === 'Dates' && (
              <DatesTab dates={dates} onCitationClick={handleCitationClick} />
            )}
            {activeTab === 'Payments' && (
              <PaymentsTab payments={payments} onCitationClick={handleCitationClick} />
            )}
            {activeTab === 'AreasToReview' && (
              <AreasToReviewTab areas={areasToReview} onCitationClick={handleCitationClick} />
            )}
            {activeTab === 'Checklist' && (
              <ChecklistTab documentId={doc.id} checklist={checklist} onCitationClick={handleCitationClick} />
            )}
            {activeTab === 'LawyerPrep' && (
              <LawyerPrepTab lawyerPrep={lawyerPrep} onCitationClick={handleCitationClick} />
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
