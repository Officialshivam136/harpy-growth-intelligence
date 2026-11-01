import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  RefreshCw,
  Building2,
  AlertTriangle,
  Bot,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  CornerDownLeft,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { aiAnalystService, DEFAULT_SUGGESTIONS } from '../services/aiAnalystService';
import { ChatBubble } from '../components/analyst/ChatBubble';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { cn } from '../utils/cn';

const DEFAULT_WELCOME_MESSAGE = {
  id: 'msg-welcome-01',
  role: 'assistant',
  text: 'Hello, J. Davenport. I am your **AI Growth Analyst** for Harpy Growth Intelligence. I have ingested live 30-day SP-API telemetry, advertising campaign logs, and product unit economics across Village Company, Premium Wellness Co., and Urban Living. How can I assist your brand performance review today?',
  time: 'Just now',
  engine: 'deterministic',
  insights: [],
  followUpQuestions: DEFAULT_SUGGESTIONS.slice(0, 3),
};

export function AiGrowthAnalyst() {
  const { brands, selectedBrand, setSelectedBrand } = useBrand();

  const [activeBrandId, setActiveBrandId] = useState(() => {
    return selectedBrand?.id || 'all';
  });

  const [messages, setMessages] = useState(() => {
    const saved = aiAnalystService.loadHistory(activeBrandId);
    return saved && saved.length > 0 ? saved : [DEFAULT_WELCOME_MESSAGE];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [engineStatus, setEngineStatus] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync engine status on mount
  useEffect(() => {
    aiAnalystService.getStatus().then((status) => setEngineStatus(status));
  }, []);

  // When active brand changes, switch conversation history
  useEffect(() => {
    const saved = aiAnalystService.loadHistory(activeBrandId);
    setMessages(saved && saved.length > 0 ? saved : [DEFAULT_WELCOME_MESSAGE]);
  }, [activeBrandId]);

  // Save history whenever messages change
  useEffect(() => {
    aiAnalystService.saveHistory(activeBrandId, messages);
  }, [messages, activeBrandId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleBrandChange = (e) => {
    const val = e.target.value;
    setActiveBrandId(val);
    const found = brands.find((b) => b.id === val);
    if (found) setSelectedBrand(found);
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset conversation history for this brand view?')) {
      aiAnalystService.clearHistory(activeBrandId);
      setMessages([DEFAULT_WELCOME_MESSAGE]);
    }
  };

  const handleSend = async (queryText = inputValue) => {
    const text = (queryText || '').trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputValue('');

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Multi-phase realistic thinking indicator steps
    setLoadingStep('Ingesting Amazon SP-API advertising & sales telemetry...');
    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Evaluating unit economics, ACOS targets & bleeder keywords...');
    }, 450);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Synthesizing agency playbook recommendations...');
    }, 900);

    try {
      const response = await aiAnalystService.sendQuery(text, activeBrandId, messages);

      const assistantMessage = {
        id: response.id || `msg-${Date.now()}`,
        role: 'assistant',
        text: response.text,
        insights: response.insights || [],
        followUpQuestions: response.followUpQuestions || DEFAULT_SUGGESTIONS.slice(0, 3),
        engine: response.engine || 'deterministic',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setErrorMessage('Failed to generate insights from telemetry. Please try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-h-[920px] space-y-4 animate-in fade-in duration-200">
      {/* 1. Page Header & Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pb-3 border-b border-harpy-cardBorder/70">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald" />
              <span>AI Growth Analyst</span>
            </h1>
            <Badge variant="electric" size="xs" dot>
              {engineStatus?.engine === 'openai' ? 'OpenAI LLM Connected' : 'Deterministic Rules Engine'}
            </Badge>
          </div>
          <p className="text-xs text-harpy-subtle mt-0.5">
            Natural-language analytics diagnostics referencing verified multi-brand figures.
          </p>
        </div>

        {/* Brand Selector & Action Strip */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-harpy-navy border border-harpy-cardBorder text-xs text-slate-200">
            <Building2 className="w-3.5 h-3.5 text-emerald shrink-0" />
            <select
              value={activeBrandId}
              onChange={handleBrandChange}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id} className="bg-harpy-charcoal text-slate-200">
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            className="text-slate-400 hover:text-rose-400 p-2"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 2. Suggested Questions Carousel / Chip Row */}
      <div className="shrink-0 space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Suggested Inquiries:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DEFAULT_SUGGESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-harpy-navy hover:bg-slate-800 border border-harpy-cardBorder hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all shrink-0 text-left disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3 text-emerald" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Chat Feed Scroll Canvas */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-4 space-y-2 rounded-2xl bg-harpy-navy/40 border border-harpy-cardBorder/60 p-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} onSelectFollowUp={(q) => handleSend(q)} />
        ))}

        {/* Clear Loading State */}
        {isLoading && (
          <div className="flex items-start gap-3.5 mb-6 animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-xl bg-harpy-navy border border-harpy-cardBorder flex items-center justify-center shrink-0 shadow-emerald-glow">
              <RefreshCw className="w-4 h-4 text-emerald animate-spin" />
            </div>
            <div className="p-4 rounded-xl bg-harpy-charcoal border border-harpy-cardBorder space-y-2 max-w-md">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                <span>Harpy Analyst is Reasoning...</span>
              </div>
              <p className="text-xs text-harpy-subtle font-mono animate-pulse">
                {loadingStep || 'Processing query against verified telemetry...'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between gap-3 text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleSend(inputValue)}
              className="text-rose-300 border-rose-500/40 hover:bg-rose-900/40"
            >
              Retry
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Chat Input Box */}
      <div className="shrink-0 pt-2">
        <div className="relative flex items-center rounded-2xl bg-harpy-charcoal border border-harpy-cardBorder focus-within:border-emerald shadow-2xl transition-all">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask about brand performance, ad waste, unit margins, ACOS spikes, or priorities..."
            className="w-full pl-4 pr-24 py-3.5 text-xs sm:text-sm bg-transparent text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <span className="hidden sm:inline-block text-[10px] text-slate-500 font-mono pr-1">
              Press ↵
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="h-8 px-3 gap-1.5 rounded-xl shadow-emerald-glow"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analyze</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiGrowthAnalyst;

