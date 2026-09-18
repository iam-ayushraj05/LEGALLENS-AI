'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowUpRight, HelpCircle, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Citation } from '@/lib/types';
import { SourceCard } from '@/components/ui/SourceCard';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Citation[];
  confidence?: string;
  uncertainties?: string[];
  needsProfessionalReview?: boolean;
}

interface AskTabProps {
  documentId: string;
  initialMessages?: Message[];
  onCitationClick?: (pageNumber: number, section?: string, excerpt?: string) => void;
}

export const AskTab: React.FC<AskTabProps> = ({ documentId, initialMessages = [], onCitationClick }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "When can either party terminate?",
    "How much do I have to pay?",
    "Does this agreement automatically renew?",
    "What are my confidentiality obligations?",
    "What happens if I miss a payment deadline?",
    "What should I ask a lawyer about?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: 'user',
      content: q.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/documents/${documentId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process query");
      }

      const assistantMsg: Message = {
        id: data.id || "bot-" + Date.now(),
        role: 'assistant',
        content: data.content,
        sources: data.sources || [],
        confidence: data.confidence,
        uncertainties: data.uncertainties,
        needsProfessionalReview: data.needsProfessionalReview
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: 'assistant',
          content: "I couldn't find enough information in the uploaded document to answer that reliably."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-230px)] min-h-[500px]">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Ask your document questions</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Receive evidence-grounded answers with direct section and page citations.
              </p>
            </div>

            {/* Suggested Question Chips */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Suggested questions:
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {suggestedQuestions.map(sq => (
                  <button
                    key={sq}
                    onClick={() => handleSend(sq)}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors text-left font-medium"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map(m => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm space-y-3 ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

              {/* Source Cards list for assistant message (Section 14) */}
              {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Grounded Source Evidence:
                  </span>
                  <div className="space-y-2">
                    {m.sources.map((src, sIdx) => (
                      <SourceCard
                        key={sIdx}
                        citation={src}
                        onClick={() => onCitationClick && onCitationClick(src.pageNumber, src.section, src.excerpt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Legal prep badge if flagged */}
              {m.needsProfessionalReview && (
                <div className="bg-purple-50 border border-purple-200 text-purple-900 p-2.5 rounded-xl text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Consider reviewing this clause with a legal professional.</span>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3.5 shadow-sm flex items-center gap-2.5 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Searching document evidence & building response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this document..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
