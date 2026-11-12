import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// The one orchestrated moment: a bug gets highlighted, struck out and replaced.
function BugFixDemo() {
  const root = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) { gsap.set('.fixed-line,.note', { opacity: 1, y: 0 }); gsap.set('.bad-line', { opacity: 0.45 }); return; }
      gsap.set('.fixed-line,.note', { opacity: 0, y: 8 });
      gsap.set('.swipe', { scaleX: 0, transformOrigin: 'left' });
      gsap.timeline({ delay: 0.6 })
        .to('.swipe', { scaleX: 1, duration: 0.7, ease: 'power2.inOut' })
        .to('.bad-line', { opacity: 0.45, duration: 0.3 }, '+=0.2')
        .to('.fixed-line', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
        .to('.note', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.1');
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="panel w-full max-w-md overflow-hidden font-mono text-[13px]">
      <div className="flex items-center gap-1.5 border-b border-line bg-paper-sunk px-4 py-2.5">
        <i className="h-2.5 w-2.5 rounded-full bg-line" /><i className="h-2.5 w-2.5 rounded-full bg-line" /><i className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-2 text-xs text-ink-faint">binary_search.py</span>
      </div>
      <div className="space-y-1 p-4 leading-7">
        <p className="text-ink-soft">def middle(lo, hi):</p>
        <p className="bad-line relative pl-6 text-bug">
          <span className="swipe absolute inset-y-0.5 -left-1 right-0 -z-0 rounded bg-mark/80" />
          <span className="relative">return (lo + hi) / 2</span>
        </p>
        <p className="fixed-line rounded bg-fix-tint pl-6 text-fix">return (lo + hi) // 2</p>
      </div>
      <p className="note border-t border-line bg-brand-tint px-4 py-3 font-sans text-sm text-brand-dark">
        <b>/</b> returns a float, so it can't index a list. <b>//</b> keeps it an integer.
      </p>
    </div>
  );
}

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="grid-paper relative hidden flex-col justify-between border-r border-line bg-paper-sunk/60 p-12 lg:flex">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand font-mono text-sm text-mark">{'</>'}</span>CodeMentor AI
        </div>
        <div className="space-y-8">
          <h2 className="max-w-md text-4xl font-semibold leading-[1.1] tracking-tight">Stuck on a bug? Get the reason, not just the fix.</h2>
          <BugFixDemo />
        </div>
        <p className="max-w-sm text-sm text-ink-soft">Answers are grounded in competitive-programming editorials, so you see where an explanation comes from.</p>
      </aside>
      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mb-8 mt-1 text-sm text-ink-soft">{subtitle}</p>
          {children}
          <p className="mt-8 text-center text-sm text-ink-soft">{footer}</p>
        </div>
      </main>
    </div>
  );
}
