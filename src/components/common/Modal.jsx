import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const panel = panelRef.current;
    const firstField = panel?.querySelector('input,select,textarea');
    (firstField ?? panel)?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current?.();
        return;
      }
      if (e.key === 'Tab' && panel) {
        const items = panel.querySelectorAll(FOCUSABLE);
        if (!items.length) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60" onClick={() => closeRef.current?.()} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`card relative max-h-[92vh] w-full overflow-y-auto rounded-b-none p-5 sm:rounded-2xl sm:p-6 ${SIZES[size] ?? SIZES.md}`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-bold">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Fermer la fenêtre" className="btn btn-ghost -mr-2 -mt-1 min-h-[40px] px-2">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
