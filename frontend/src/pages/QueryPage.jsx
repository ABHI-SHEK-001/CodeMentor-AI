import React, { useState, useEffect, useRef } from 'react';
import { Bug, BookOpen, Wand2, Zap, Send, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';
import { queryAPI } from '../services/api';
import QueryResponse from '../components/QueryResponse';

const MODES = [
  { value: 'debug', label: 'Debug', hint: 'Find why code fails', icon: Bug },
  { value: 'explain', label: 'Explain', hint: 'Understand a concept', icon: BookOpen },
  { value: 'generate', label: 'Generate', hint: 'Write new practice code', icon: Wand2 },
  { value: 'optimize', label: 'Optimize', hint: 'Make it faster', icon: Zap },
];
const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin'];
const STEPS = ['Understanding your question', 'Searching editorials', 'Writing the answer'];

function Progress() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, STEPS.length - 1)), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <ol className="panel space-y-3 p-6" aria-live="polite">
      {STEPS.map((s, n) => (
        <li key={s} className={`flex items-center gap-3 text-sm ${n > i ? 'text-ink-faint' : 'text-ink'}`}>
          {n < i ? <Check className="h-4 w-4 text-fix" /> : n === i ? <Loader2 className="h-4 w-4 animate-spin text-brand" /> : <span className="h-4 w-4 rounded-full border border-line" />}
          {s}
        </li>
      ))}
    </ol>
  );
}

export default function QueryPage() {
  const [form, setForm] = useState({ question: '', code_snippet: '', language: 'python', error_message: '', query_type: 'debug' });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const page = useRef(null);
  const out = useRef(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => gsap.from('.intro', { opacity: 0, y: 12, duration: 0.5, ease: 'power3.out' }), page);
    return () => ctx.revert();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) return toast.error('Describe your problem first');
    setLoading(true);
    setResponse(null);
    if (window.innerWidth < 1024) out.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      const { data } = await queryAPI.submit(form);
      setResponse(data);
      data.status === 'failed' ? toast.error('The mentor could not answer this one. Try rephrasing.') : toast.success('Answer ready');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not send your question. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={page} className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="intro mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">What are you working on?</h1>
        <p className="mt-1 text-ink-soft">Paste your code and the error. Get an explanation you can learn from.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form onSubmit={submit} className="panel space-y-5 p-5 sm:p-6 lg:self-start">
          <div role="radiogroup" aria-label="Help type" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MODES.map(({ value, label, hint, icon: Icon }) => {
              const on = form.query_type === value;
              return (
                <button key={value} type="button" role="radio" aria-checked={on} title={hint}
                  onClick={() => setForm({ ...form, query_type: value })}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${on ? 'border-brand bg-brand-tint text-brand' : 'border-line text-ink-soft hover:bg-paper-sunk'}`}>
                  <Icon className="h-4 w-4" />{label}
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="q" className="label">Your question</label>
            <textarea id="q" className="field min-h-[96px] resize-y" placeholder="Why does my binary search crash on even-length lists?" value={form.question} onChange={set('question')} required />
          </div>
          <div>
            <label htmlFor="c" className="label">Code <span className="font-normal text-ink-faint">optional</span></label>
            <textarea id="c" spellCheck="false" className="field min-h-[170px] resize-y font-mono text-[13px] leading-6" placeholder="Paste your code" value={form.code_snippet} onChange={set('code_snippet')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
            <div>
              <label htmlFor="l" className="label">Language</label>
              <select id="l" className="field" value={form.language} onChange={set('language')}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="e" className="label">Error message <span className="font-normal text-ink-faint">optional</span></label>
              <input id="e" className="field font-mono text-[13px]" placeholder="IndexError: list index out of range" value={form.error_message} onChange={set('error_message')} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? 'Working on it' : 'Ask CodeMentor'}
          </button>
        </form>

        <div ref={out} className="min-w-0 scroll-mt-20">
          {loading ? <Progress /> : response ? <QueryResponse response={response} /> : (
            <div className="grid-paper grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-line p-8 text-center">
              <p className="max-w-xs text-sm text-ink-soft">Your answer, the suggested code and practice problems will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
