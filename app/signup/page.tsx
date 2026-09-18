'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Scale, Lock, Mail, User, Globe, AlertTriangle, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jurisdiction, setJurisdiction] = useState('United States (General)');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, jurisdiction })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Signup failed.");
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center p-4 py-12 focus:outline-none">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold mx-auto flex items-center justify-center">
              <Scale className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-xs text-slate-400">Start understanding your legal documents with LegalLens AI</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2" role="alert">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-300 mb-1">Full name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" aria-hidden="true" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" aria-hidden="true" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" aria-hidden="true" />
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-jurisdiction" className="block text-xs font-semibold text-slate-300 mb-1">Jurisdiction preference</label>
              <select
                id="signup-jurisdiction"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
                aria-label="Select legal jurisdiction"
              >
                <option value="United States (General)">United States (General)</option>
                <option value="California, US">California, US</option>
                <option value="New York, US">New York, US</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="European Union">European Union</option>
                <option value="India">India</option>
                <option value="Other / International">Other / International</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
              aria-label="Create new account"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-400 hover:underline font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
