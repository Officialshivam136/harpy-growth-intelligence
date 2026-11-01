import React from 'react';
import { User, Sparkles, Clock, ArrowRight, Bot } from 'lucide-react';
import { InsightCard } from './InsightCard';
import { cn } from '../../utils/cn';

export function ChatBubble({ message, onSelectFollowUp }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 mb-6 animate-in fade-in duration-150">
        <div className="max-w-2xl space-y-1">
          <div className="bg-gradient-to-r from-sky-600 to-electric text-slate-950 font-medium px-4 py-3 rounded-2xl rounded-tr-sm shadow-md text-xs sm:text-sm">
            {message.text}
          </div>
          <div className="text-right text-[10px] text-harpy-subtle font-mono pr-1">
            {message.time || 'Just now'}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-electric/20 border border-electric/40 flex items-center justify-center font-bold text-electric text-xs shrink-0">
          JD
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5 mb-6 animate-in fade-in duration-200">
      {/* Harpy Growth AI Emblem */}
      <div className="relative w-8 h-8 rounded-xl bg-harpy-navy border border-harpy-cardBorder flex items-center justify-center shrink-0 shadow-emerald-glow mt-1">
        <Sparkles className="w-4 h-4 text-emerald" />
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald ring-2 ring-harpy-charcoal" />
      </div>

      <div className="flex-1 max-w-3xl space-y-3 min-w-0">
        {/* Assistant Header & Engine Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-tight">Harpy Growth Analyst</span>
          <span className="text-[10px] font-semibold text-slate-400 bg-harpy-navy px-1.5 py-0.2 rounded border border-harpy-cardBorder">
            {message.engine === 'openai' ? 'OpenAI Grounded' : 'Deterministic Intelligence'}
          </span>
          <span className="text-[10px] text-harpy-subtle font-mono ml-auto">
            {message.time || 'Just now'}
          </span>
        </div>

        {/* Executive Direct Answer */}
        {message.text && (
          <div className="p-4 rounded-xl bg-harpy-charcoal border border-harpy-cardBorder/90 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans shadow-sm">
            {message.text}
          </div>
        )}

        {/* Structured Insight Cards List */}
        {message.insights && message.insights.length > 0 && (
          <div className="space-y-3 pt-1">
            {message.insights.map((ins) => (
              <InsightCard key={ins.id} insight={ins} />
            ))}
          </div>
        )}

        {/* Follow-up Questions Pills */}
        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Suggested Next Inquiries:
            </span>
            <div className="flex flex-wrap gap-2">
              {message.followUpQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectFollowUp(q)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-harpy-navy/80 hover:bg-slate-800 border border-harpy-cardBorder hover:border-slate-700 text-xs text-sky-400 hover:text-white transition-all text-left group"
                >
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-electric transition-colors shrink-0" />
                  <span className="truncate max-w-xs">{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBubble;

