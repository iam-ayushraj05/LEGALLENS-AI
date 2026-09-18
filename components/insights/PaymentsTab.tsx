'use client';

import React from 'react';
import { DollarSign, CreditCard, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ExtractedPayment } from '@/lib/types';

interface PaymentsTabProps {
  payments: ExtractedPayment[];
  onCitationClick?: (pageNumber: number, section?: string) => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments, onCitationClick }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No specific monetary payment terms detected in this document.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {payments.map((p, idx) => (
        <div key={p.id || idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Payment Structure
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{p.title}</h3>
              </div>
            </div>

            <button
              onClick={() => onCitationClick && onCitationClick(p.pageNumber, p.section)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors shrink-0"
            >
              <span>Page {p.pageNumber}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-0.5">Amount / Fee</span>
              <span className="text-slate-900 font-extrabold text-base text-emerald-700">{p.amount} {p.currency}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-0.5">Due Date</span>
              <span className="text-slate-800 font-semibold">{p.dueDate || 'Unspecified'}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-0.5">Late Fee / Interest</span>
              <span className="text-amber-800 font-semibold">{p.lateFee || 'Not specified'}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-0.5">Frequency</span>
              <span className="text-slate-800 font-semibold">{p.frequency || 'One-time / Per Invoice'}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border-l-2 border-emerald-500 text-xs font-mono text-slate-700">
            <span className="font-sans text-[10px] font-semibold text-slate-400 uppercase block mb-1">Source Excerpt:</span>
            "{p.sourceExcerpt}"
          </div>
        </div>
      ))}
    </div>
  );
};
