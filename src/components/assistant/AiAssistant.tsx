import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Bot, X, Send, Sparkles, User } from 'lucide-react';
import { getAssistantReply, WELCOME, SUGGESTED_QUESTIONS, type QuickAction } from './logic';

interface Message {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  quickActions?: QuickAction[];
}

let idCounter = 0;
const nextId = () => ++idCounter;

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: nextId(), role: 'assistant', text: WELCOME.text, quickActions: WELCOME.quickActions },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opening; Escape to close
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Show tooltip once briefly on desktop
  useEffect(() => {
    if (open) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;
    const t = setTimeout(() => setShowTooltip(true), 1500);
    const t2 = setTimeout(() => setShowTooltip(false), 6000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [open]);

  const handleQuickAction = (qa: QuickAction) => {
    if (qa.action === 'scroll') {
      document.querySelector(qa.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Message = { id: nextId(), role: 'user', text: trimmed };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate a brief thinking delay for natural feel
    setTimeout(() => {
      const reply = getAssistantReply(trimmed);
      setMessages((p) => [
        ...p,
        { id: nextId(), role: 'assistant', text: reply.text, quickActions: reply.quickActions },
      ]);
      setLoading(false);
    }, 550);
  };

  const onSubmit = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Floating button - bottom LEFT */}
      <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-2 sm:bottom-7 sm:left-7">
        {/* Tooltip */}
        {showTooltip && !open && (
          <div className="mb-1 hidden items-center gap-2 rounded-lg bg-navy-900 px-3 py-2 text-sm font-medium text-white shadow-xl animate-fade-in lg:flex">
            <Sparkles className="h-4 w-4 text-accent-500" />
            AI Assistant
            <span className="absolute -bottom-1 left-7 h-2 w-2 rotate-45 bg-navy-900" />
          </div>
        )}

        <button
          ref={buttonRef}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close AI Assistant' : 'Open AI Assistant'}
          aria-expanded={open}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-white shadow-xl shadow-navy-900/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-navy-900/40 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
        >
          {/* Orange accent ring */}
          <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-accent-500/40" />
          {!open && (
            <span className="pointer-events-none absolute inset-0 rounded-full bg-accent-500/30 animate-pulse-ring" />
          )}
          {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          {/* Accent dot */}
          {!open && (
            <span className="absolute right-1 top-1 h-3 w-3 rounded-full bg-accent-500 ring-2 ring-navy-900" />
          )}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Logistics AI Assistant"
          className="fixed bottom-24 left-4 z-[65] flex max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-navy-900/25 ring-1 ring-navy-900/10 animate-slide-up sm:bottom-28 sm:left-7"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-navy-900 px-4 py-3.5 text-white">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Bot className="h-5 w-5 text-accent-500" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-navy-900" />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-bold leading-tight">Logistics AI Assistant</h3>
              <p className="text-xs text-white/60">Your virtual logistics support</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="chat-scroll flex-1 space-y-4 overflow-y-auto bg-mist px-4 py-4"
          >
            {messages.map((m) => (
              <div key={m.id}>
                <div
                  className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      m.role === 'user'
                        ? 'bg-navy-900 text-white'
                        : 'bg-accent-500 text-white'
                    }`}
                  >
                    {m.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </span>
                  <div
                    className={`max-w-[78%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-navy-900 text-white'
                        : 'rounded-tl-sm bg-white text-ink shadow-sm ring-1 ring-navy-900/5'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
                {/* Quick actions */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2 pl-9">
                    {m.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(qa)}
                        className="rounded-full border border-accent-500/30 bg-accent-500/5 px-3 py-1.5 text-xs font-semibold text-accent-600 transition-all hover:bg-accent-500 hover:text-white"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-navy-900/5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-navy-900/40 animate-dot-bounce"
                      style={{ animationDelay: `${i * 0.16}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggested questions (only at start) */}
          {messages.length <= 1 && !loading && (
            <div className="border-t border-navy-900/5 bg-white px-4 py-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full bg-mist px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-navy-900 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-navy-900/5 bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onSubmit}
                rows={1}
                placeholder="Type your message…"
                aria-label="Message"
                className="max-h-24 flex-1 resize-none rounded-xl border border-navy-900/15 bg-mist px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-white transition-all hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-ink/35">
              Demo assistant · Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
}
