import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const STYLES = {
  success: { icon: CheckCircle2, cls: 'border-green-300 dark:border-green-700', color: 'text-green-600 dark:text-green-400', label: 'Succès' },
  error: { icon: AlertTriangle, cls: 'border-red-300 dark:border-red-700', color: 'text-red-600 dark:text-red-400', label: 'Erreur' },
  info: { icon: Info, cls: 'border-indigo-300 dark:border-indigo-700', color: 'text-primary dark:text-indigo-300', label: 'Information' },
};

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => {
        const style = STYLES[t.type] ?? STYLES.info;
        const Icon = style.icon;
        return (
          <div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            className={`card pointer-events-auto flex w-full max-w-sm items-start gap-3 border p-3 ${style.cls}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.color}`} aria-hidden="true" />
            <p className="flex-1 text-sm">
              <span className="sr-only">{style.label} : </span>
              {t.message}
            </p>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Fermer la notification" className="rounded p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
