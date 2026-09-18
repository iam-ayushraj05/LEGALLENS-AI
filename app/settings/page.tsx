'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { LegalDisclaimer } from '@/components/layout/LegalDisclaimer';
import { Settings, Globe, Shield, Trash2, CheckCircle2, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [jurisdiction, setJurisdiction] = useState('United States (General)');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          if (data.user.jurisdiction) setJurisdiction(data.user.jurisdiction);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jurisdiction })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full space-y-8">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-bold">Account & Legal Settings</h1>
          </div>
          <p className="text-xs text-slate-400">
            Configure jurisdiction preferences, security controls, and privacy settings.
          </p>
        </div>

        {/* Jurisdiction Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Primary Jurisdiction Preference</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            LegalLens uses your jurisdiction setting to contextualize governing law provisions and lawyer preparation briefs.
          </p>

          <select
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            {[
              'United States (General)',
              'California, US',
              'New York, US',
              'Texas, US',
              'United Kingdom',
              'European Union',
              'Canada',
              'India',
              'Australia',
              'Other / International'
            ].map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
            >
              Save Preferences
            </button>
            {saved && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Saved successfully
              </span>
            )}
          </div>
        </div>

        {/* Privacy & Data Retention Policy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Privacy & Data Retention</h3>
          </div>
          <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>
              <strong>Data Isolation:</strong> All uploaded contracts, embeddings, and chat histories are private to your user account and strictly protected.
            </p>
            <p>
              <strong>Permanent Deletion:</strong> When you delete a document from your dashboard, all associated text chunks, embeddings, extraction analyses, checklists, and chat logs are deleted permanently.
            </p>
            <p>
              <strong>No AI Training on Documents:</strong> Your document text is processed solely for your evidence retrieval and is never used to train global AI foundation models.
            </p>
          </div>
        </div>

        {/* Security & Account Protection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base">Prompt Injection Defense</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            LegalLens AI treats all uploaded document text as untrusted evidence. System directives strictly prevent malicious contract instructions from overriding application security boundary controls.
          </p>
        </div>
      </main>
    </div>
  );
}
