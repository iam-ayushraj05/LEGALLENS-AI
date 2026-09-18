'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { DocumentWorkspace } from '@/components/viewer/DocumentWorkspace';
import { DEMO_DOCUMENT_ID, DEMO_ANALYSIS_DATA } from '@/lib/services/demoData';
import { Loader2, AlertCircle } from 'lucide-react';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    if (id === DEMO_DOCUMENT_ID) {
      setData(DEMO_ANALYSIS_DATA);
      setLoading(false);
      return;
    }

    fetch(`/api/documents/${id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Document not found");
        }
        setData(json);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading document intelligence workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Document Not Found</h2>
          <p className="text-xs text-slate-400 max-w-sm text-center">
            {error || "We couldn't locate this document or you do not have permission to view it."}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Navbar />
      <DocumentWorkspace data={data} />
    </div>
  );
}
