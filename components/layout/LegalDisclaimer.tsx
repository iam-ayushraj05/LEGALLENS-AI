import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface LegalDisclaimerProps {
  variant?: 'banner' | 'footer' | 'inline';
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ variant = 'banner' }) => {
  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-slate-700">Legal Safety Notice: </strong>
          LegalLens AI provides legal document understanding and assistance, <strong>NOT legal advice</strong>. It does not replace a qualified legal professional or establish an attorney-client relationship.
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 text-xs py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>LegalLens AI &copy; {new Date().getFullYear()} &bull; Evidence-First Legal Document Intelligence</span>
          </div>
          <p className="text-center sm:text-right max-w-xl text-slate-400">
            <strong>Legal Information Notice:</strong> This application is designed for document analysis and preparation assistance. Content provided does not constitute definitive legal advice. Consult a licensed attorney for binding legal counsel.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            <strong className="text-white">Legal Information & Assistant:</strong> LegalLens provides plain-English analysis and evidence citations. Not legal advice or legal representation.
          </span>
        </div>
        <a href="#disclaimer-modal" className="text-amber-400 hover:underline shrink-0 text-[11px]">
          Safety Notice
        </a>
      </div>
    </div>
  );
};
