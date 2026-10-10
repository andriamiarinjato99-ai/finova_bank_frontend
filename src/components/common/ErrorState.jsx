import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center px-4 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold">Un problème est survenu</h3>
      <p className="mt-1 max-w-md text-sm muted">{message ?? 'Impossible de charger les données.'}</p>
      {onRetry && (
        <Button variant="secondary" icon={RefreshCw} onClick={onRetry} className="mt-5">
          Réessayer
        </Button>
      )}
    </div>
  );
}
