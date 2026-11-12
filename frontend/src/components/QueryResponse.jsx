import React from 'react';
import { BookOpen, Code2, Lightbulb, Database } from 'lucide-react';
import CodeBlock from './CodeBlock';

function Section({ icon: Icon, title, note, children }) {
  return (
    <section className="panel p-5 sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
        <Icon className="h-4 w-4 text-brand" />{title}
        {note && <span className="text-sm font-normal text-ink-faint">{note}</span>}
      </h3>
      {children}
    </section>
  );
}

export default function QueryResponse({ response }) {
  if (!response) return null;
  const { explanation, fixed_code, similar_problems, retrieved_context, processing_time_ms, model_used, language } = response;

  return (
    <div className="space-y-4">
      {(processing_time_ms || model_used) && (
        <p className="text-xs text-ink-faint">
          {processing_time_ms ? `Answered in ${(processing_time_ms / 1000).toFixed(1)} s` : ''}
          {processing_time_ms && model_used ? ' with ' : ''}{model_used}
        </p>
      )}

      {explanation && (
        <Section icon={BookOpen} title="What's going on">
          <p className="max-w-[68ch] whitespace-pre-wrap leading-relaxed text-ink-soft">{explanation}</p>
        </Section>
      )}

      {fixed_code && (
        <Section icon={Code2} title="Suggested code">
          <CodeBlock code={fixed_code} language={language || 'python'} />
        </Section>
      )}

      {similar_problems?.length > 0 && (
        <Section icon={Lightbulb} title="Practice next">
          <ul className="divide-y divide-line">
            {similar_problems.map((p, i) => (
              <li key={i} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium">{p.title}</p>
                {p.approach && <p className="mt-0.5 text-sm text-ink-soft">{p.approach}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {retrieved_context?.length > 0 && (
        <Section icon={Database} title="Sources used" note={`${retrieved_context.length} passages`}>
          <div className="space-y-2">
            {retrieved_context.map((c, i) => (
              <details key={i} className="group rounded-lg bg-paper-sunk">
                <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm marker:hidden">
                  <span className="font-medium">Source {i + 1}</span>
                  {c.source && <span className="truncate pl-3 text-xs text-ink-faint">{c.source}</span>}
                </summary>
                <p className="whitespace-pre-wrap px-3 pb-3 text-xs leading-relaxed text-ink-soft">
                  {c.content?.substring(0, 500)}{c.content?.length > 500 && '…'}
                </p>
              </details>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
