export default function ProgressBar({ value, max, label, tone = 'primary' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const color = tone === 'warning' ? 'bg-warning' : tone === 'danger' ? 'bg-danger' : 'bg-primary';
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
    >
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
