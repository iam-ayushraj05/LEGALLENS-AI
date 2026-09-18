'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Scale, Play, Globe, User, LogOut, ChevronDown, GitCompare, CheckSquare, Settings, Sparkles, Cpu } from 'lucide-react';
import { DEMO_DOCUMENT_ID } from '@/lib/services/demoData';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; jurisdiction?: string } | null>(null);
  const [jurisdiction, setJurisdiction] = useState<string>('United States (General)');
  const [isJurisdictionModalOpen, setIsJurisdictionModalOpen] = useState(false);
  const [aiMode, setAiMode] = useState<{ mode: 'live' | 'demo'; label: string }>({
    mode: 'demo',
    label: 'Demo / Local Analysis'
  });

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

    fetch('/api/ai/mode')
      .then(res => res.json())
      .then(data => {
        if (data.mode) setAiMode(data);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const handleUpdateJurisdiction = async (newJurisdiction: string) => {
    setJurisdiction(newJurisdiction);
    setIsJurisdictionModalOpen(false);
    await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jurisdiction: newJurisdiction })
    });
  };

  const isDemoActive = pathname?.includes(DEMO_DOCUMENT_ID);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                LegalLens <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">Understand the fine print.</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link
              href="/compare"
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${pathname?.startsWith('/compare') ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'}`}
            >
              <GitCompare className="w-3.5 h-3.5 text-amber-400" />
              Compare
            </Link>
            <Link
              href="/checklists"
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${pathname === '/checklists' ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'}`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              Checklists
            </Link>
            <Link
              href="/settings"
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${pathname === '/settings' ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'}`}
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              Settings
            </Link>
          </nav>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* AI Mode Indicator Badge */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              aiMode.mode === 'live'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
            title={aiMode.mode === 'live' ? 'Live OpenAI Model Active' : 'Offline Heuristic Extraction & Local Demo Active'}
          >
            {aiMode.mode === 'live' ? <Sparkles className="w-3 h-3 text-emerald-400" /> : <Cpu className="w-3 h-3 text-amber-400" />}
            <span>{aiMode.label}</span>
          </div>

          {/* Jurisdiction Badge */}
          <button
            onClick={() => setIsJurisdictionModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500 transition-colors"
            title="Relevant legal jurisdiction preference"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[120px] truncate">{jurisdiction}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Try Demo Button */}
          <Link
            href={`/documents/${DEMO_DOCUMENT_ID}`}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isDemoActive
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/50'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:brightness-110 shadow-sm shadow-amber-500/20'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Try Demo</span>
          </Link>

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-semibold text-xs hover:bg-slate-700"
                title={user.email}
              >
                {user.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium">
              <Link href="/login" className="text-slate-300 hover:text-white px-2 py-1">
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Jurisdiction Selection Modal */}
      {isJurisdictionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-lg">Relevant Jurisdiction</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Select your primary jurisdiction to contextualize document governing laws and legal guidance terms.
            </p>
            <div className="space-y-2 mb-6">
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
              ].map(item => (
                <button
                  key={item}
                  onClick={() => handleUpdateJurisdiction(item)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    jurisdiction === item
                      ? 'bg-amber-400/10 border border-amber-400/40 text-amber-300'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                  }`}
                >
                  <span>{item}</span>
                  {jurisdiction === item && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsJurisdictionModalOpen(false)}
              className="w-full py-2 rounded-lg bg-slate-800 text-xs font-semibold hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
