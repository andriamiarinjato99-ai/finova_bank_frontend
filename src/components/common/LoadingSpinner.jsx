import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Chargement…', className = '' }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 py-12 text-sm muted ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
