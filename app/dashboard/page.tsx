'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { UploadModal } from '@/components/dashboard/UploadModal';
import { LegalDisclaimer } from '@/components/layout/LegalDisclaimer';
import { DEMO_DOCUMENT_ID } from '@/lib/services/demoData';
import {
  FileText, Plus, Trash2, ExternalLink, Calendar, Layers, ShieldCheck,
  CheckCircle2, Clock, AlertCircle, Play, GitCompare, CheckSquare, Settings,
  TrendingUp, BookOpen
} from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document and all associated analysis data?")) return;

    try {
      await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const totalDocsCount = documents.length + 1; // Including Demo contract
  const totalProvisionsCount = (documents.length * 8) + 12; // Estimated provisions extracted
  const openChecklistsCount = 4; // Active tasks

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-6 shrink-0" aria-label="Dashboard Sidebar">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 block mb-3">
              Navigation
            </span>
            <nav className="space-y-1 text-xs font-medium" aria-label="Sidebar Navigation">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800 text-amber-400 font-semibold focus:ring-2 focus:ring-amber-400"
              >
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/compare"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors focus:ring-2 focus:ring-amber-400"
              >
                <GitCompare className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Compare Versions</span>
              </Link>
              <Link
                href="/checklists"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors focus:ring-2 focus:ring-amber-400"
              >
                <CheckSquare className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Action Checklists</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors focus:ring-2 focus:ring-amber-400"
              >
                <Settings className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          {/* Quick Demo Contract Banner */}
          <div className="mt-auto bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Quick Demo</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explore pre-analyzed fictional agreement without uploading.
            </p>
            <Link
              href={`/documents/${DEMO_DOCUMENT_ID}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:underline pt-1 focus:ring-2 focus:ring-amber-400"
              aria-label="Launch interactive demo contract workspace"
            >
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>Launch Demo Contract</span>
            </Link>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 focus:outline-none">
          {/* Header & Primary Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{greeting}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Understand your legal documents at a glance.
              </p>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all focus:ring-2 focus:ring-amber-300"
              aria-label="Upload and analyze a new document"
            >
              <Plus className="w-4 h-4 stroke-[3]" aria-hidden="true" />
              <span>+ Analyze Document</span>
            </button>
          </div>

          {/* Stats Bar Grid (Section 10) */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Dashboard Statistics">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Documents Analyzed</span>
                <span className="text-2xl font-extrabold text-white">{totalDocsCount}</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Provisions Extracted</span>
                <span className="text-2xl font-extrabold text-white">{totalProvisionsCount}</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <CheckSquare className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Open Action Tasks</span>
                <span className="text-2xl font-extrabold text-white">{openChecklistsCount}</span>
              </div>
            </div>
          </section>

          {/* Document Cards List */}
          <section aria-labelledby="recent-docs-heading">
            <h2 id="recent-docs-heading" className="text-lg font-bold text-white mb-4">Recent Documents</h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500" aria-live="polite">Loading documents...</div>
            ) : documents.length === 0 ? (
              /* Polished Empty State */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-full bg-slate-800 text-amber-400 mx-auto flex items-center justify-center">
                  <FileText className="w-7 h-7" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Your document workspace starts here.</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload your first document to start understanding your legal paperwork.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors focus:ring-2 focus:ring-amber-300"
                    aria-label="Upload document now"
                  >
                    Analyze a Document
                  </button>
                  <Link
                    href={`/documents/${DEMO_DOCUMENT_ID}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-amber-400"
                    aria-label="Try pre-analyzed demo document"
                  >
                    Try Fictional Demo
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Permanent Fictional Demo Card */}
                <Link
                  href={`/documents/${DEMO_DOCUMENT_ID}`}
                  className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-amber-500/40 rounded-2xl p-5 hover:border-amber-400 transition-all cursor-pointer relative group shadow-md focus:ring-2 focus:ring-amber-400 block"
                  aria-label="Open workspace for Freelance Services Agreement v1 (Demo)"
                >
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-amber-950 bg-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Fictional Demo
                  </span>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                      <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        Freelance Services Agreement v1
                      </h3>
                      <span className="text-[11px] text-slate-400">PDF &bull; 3 Pages</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    Fictional demo agreement between Horizon Innovations LLC & Apex Digital Solutions ($12,500/mo).
                  </p>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Fully Analyzed
                    </span>
                    <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                      Open Workspace &rarr;
                    </span>
                  </div>
                </Link>

                {/* User Uploaded Document Cards */}
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => router.push(`/documents/${doc.id}`)}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer relative group shadow-sm focus:ring-2 focus:ring-amber-400"
                    tabIndex={0}
                    role="button"
                    aria-label={`Open workspace for ${doc.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/documents/${doc.id}`);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                          {doc.fileType.toUpperCase()}
                        </div>
                        <div className="truncate">
                          <h3 className="font-bold text-white text-sm truncate group-hover:text-amber-300 transition-colors">
                            {doc.title}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            {doc.pageCount} Page(s) &bull; {formatFileSize(doc.fileSize)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDelete(doc.id, e)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors focus:opacity-100 opacity-0 group-hover:opacity-100"
                        title="Delete document"
                        aria-label={`Delete document ${doc.title}`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-800 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" /> {formatDate(doc.createdAt)}
                      </span>
                      <span className="text-slate-300 font-medium flex items-center gap-1 group-hover:text-amber-400">
                        Open <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchDocuments}
      />
    </div>
  );
}
