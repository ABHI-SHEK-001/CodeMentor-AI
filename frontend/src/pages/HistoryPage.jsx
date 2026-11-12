import React, { useState, useEffect } from 'react';
import { Bug, BookOpen, Wand2, Zap, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { queryAPI } from '../services/api';
import QueryResponse from '../components/QueryResponse';

const TYPES = { debug: Bug, explain: BookOpen, generate: Wand2, optimize: Zap };

const Stat = ({ label, value }) => (
  <div className="panel px-5 py-4">
    <p className="text-sm text-ink-soft">{label}</p>
    <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
  </div>
);

export default function HistoryPage() {
  const [queries, setQueries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await queryAPI.getHistory(page);
        setQueries(data.results || []);
        setPages(Math.max(1, Math.ceil((data.count || 0) / 20)));
      } catch { toast.error('Could not load your history'); }
      finally { setLoading(false); }
    })();
  }, [page]);

  useEffect(() => {
    queryAPI.getStats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const open = async (id) => {
    try { setSelected((await queryAPI.getDetail(id)).data); }
    catch { toast.error('Could not open that question'); }
  };
  const date = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">History</h1>
        <p className="mt-1 text-ink-soft">Everything you have asked, with the full answer one click away.</p>
      </header>

      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Questions asked" value={stats.total_queries} />
          <Stat label="Answered" value={stats.completed_queries} />
          <Stat label="Average time" value={stats.avg_processing_time_ms ? `${(stats.avg_processing_time_ms / 1000).toFixed(1)} s` : '–'} />
          <Stat label="Average rating" value={stats.avg_feedback_rating ? `${stats.avg_feedback_rating.toFixed(1)} / 5` : '–'} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          {loading ? (
            [0, 1, 2, 3].map((n) => <div key={n} className="h-[72px] animate-pulse rounded-xl bg-paper-sunk" />)
          ) : queries.length === 0 ? (
            <div className="panel flex flex-col items-center gap-2 p-10 text-center">
              <Inbox className="h-6 w-6 text-ink-faint" />
              <p className="text-sm text-ink-soft">No questions yet. Ask your first one from the Ask tab.</p>
            </div>
          ) : (
            queries.map((q) => {
              const Icon = TYPES[q.query_type] || Bug;
              const on = selected?.id === q.id;
              return (
                <button key={q.id} onClick={() => open(q.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${on ? 'border-brand bg-brand-tint' : 'border-line bg-paper-raised hover:bg-paper-sunk'}`}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-paper-sunk text-brand"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{q.question}</span>
                    <span className="mt-0.5 flex gap-3 text-xs text-ink-faint">
                      <span className="font-mono">{q.language}</span>
                      <span className={q.status === 'completed' ? 'text-fix' : 'text-bug'}>{q.status}</span>
                      {q.processing_time_ms && <span>{(q.processing_time_ms / 1000).toFixed(1)} s</span>}
                    </span>
                  </span>
                  <span className="whitespace-nowrap text-xs text-ink-faint">{date(q.created_at)}</span>
                </button>
              );
            })
          )}

          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-3">
              <button aria-label="Previous page" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn-ghost px-2.5"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-sm text-ink-soft">Page {page} of {pages}</span>
              <button aria-label="Next page" onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages} className="btn-ghost px-2.5"><ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>

        <div className="min-w-0">
          {selected ? <div className="lg:sticky lg:top-20"><QueryResponse response={selected} /></div> : (
            <div className="grid-paper grid min-h-[260px] place-items-center rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
              Select a question to read the full answer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
