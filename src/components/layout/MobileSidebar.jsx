import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SidebarContent } from './Sidebar';

export default function MobileSidebar({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl dark:bg-slate-900"
      >
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Fermer le menu"
          className="btn btn-ghost absolute right-2 top-3 min-h-[44px] min-w-[44px] px-2"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
