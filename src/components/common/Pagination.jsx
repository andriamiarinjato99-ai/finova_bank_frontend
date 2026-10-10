import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({ page, count, pageSize, hasNext, hasPrevious, onChange }) {
  const totalPages = pageSize ? Math.max(1, Math.ceil(count / pageSize)) : null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 pt-4">
      <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={!hasPrevious} onClick={() => onChange(page - 1)}>
        Précédent
      </Button>
      <p className="text-sm muted" aria-live="polite">
        Page {page}
        {totalPages ? ` sur ${totalPages}` : ''}
      </p>
      <Button variant="secondary" size="sm" disabled={!hasNext} onClick={() => onChange(page + 1)}>
        Suivant
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}
