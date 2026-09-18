'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Clock, User, ArrowUpRight } from 'lucide-react';
import { ChecklistItem } from '@/lib/types';

interface ChecklistTabProps {
  documentId: string;
  checklist: ChecklistItem[];
  onCitationClick?: (pageNumber: number, section?: string) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({ documentId, checklist, onCitationClick }) => {
  const [items, setItems] = useState<ChecklistItem[]>(checklist);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setItems(prev => prev.map((item, idx) => (item.id === id || `item-${idx}` === id) ? { ...item, completed: nextStatus } : item));

    try {
      await fetch(`/api/documents/${documentId}/checklist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, completed: nextStatus })
      });
    } catch (err) {
      console.error("Failed to update checklist item:", err);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No action checklist items generated for this document.
      </div>
    );
  }

  const completedCount = items.filter(i => i.completed).length;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Action Checklist</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedCount} of {items.length} tasks completed
          </p>
        </div>

        <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const itemId = item.id || `item-${idx}`;

          return (
            <div
              key={itemId}
              onClick={() => toggleItem(itemId, item.completed)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                item.completed
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
              }`}
            >
              <button className="mt-0.5 shrink-0 text-emerald-600">
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                )}
              </button>

              <div className="flex-1">
                <span className={`text-xs font-semibold block ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {item.action}
                </span>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                  {item.deadline && (
                    <span className="flex items-center gap-1 font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {item.deadline}
                    </span>
                  )}

                  {item.responsibleParty && (
                    <span className="flex items-center gap-1 text-slate-600">
                      <User className="w-3 h-3 text-slate-400" />
                      {item.responsibleParty}
                    </span>
                  )}

                  {item.pageNumber && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onCitationClick) onCitationClick(item.pageNumber!, item.section);
                      }}
                      className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold ml-auto"
                    >
                      <span>Page {item.pageNumber}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
