import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const TONES = {
  error: { icon: AlertTriangle, cls: 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-500/10 dark:text-red-200', role: 'alert' },
  success: { icon: CheckCircle2, cls: 'border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-500/10 dark:text-green-200', role: 'status' },
  info: { icon: Info, cls: 'border-indigo-200 bg-primary-soft text-indigo-950 dark:border-indigo-800 dark:bg-primary/10 dark:text-indigo-100', role: 'status' },
  warning: { icon: AlertTriangle, cls: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-500/10 dark:text-amber-200', role: 'status' },
};

export default function Alert({ tone = 'info', title, children, className = '' }) {
  const t = TONES[tone] ?? TONES.info;
  const Icon = t.icon;
  return (
    <div role={t.role} className={`flex gap-3 rounded-xl border p-3 text-sm ${t.cls} ${className}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-bold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
