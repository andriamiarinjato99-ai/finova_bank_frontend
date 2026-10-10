import { Pencil, Trash2 } from 'lucide-react';
import { maskAccountNumber } from '../../utils/formatAmount';
import { initials } from '../../utils/normalize';
import Button from '../common/Button';

export default function BeneficiaryCard({ beneficiary: b, onEdit, onDelete }) {
  return (
    <article className="card flex items-center gap-4 p-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary-dark dark:bg-primary/20 dark:text-indigo-200" aria-hidden="true">
        {initials(b.name)}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold">{b.name}</h3>
        <p className="text-sm muted">
          {maskAccountNumber(b.accountNumber)}
          {b.bank ? ` · ${b.bank}` : ''}
        </p>
        {!b.active && <span className="badge badge-neutral mt-1">Inactif</span>}
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
        <Button variant="secondary" size="sm" icon={Pencil} onClick={() => onEdit(b)} aria-label={`Modifier ${b.name}`}>
          Modifier
        </Button>
        <Button variant="secondary" size="sm" icon={Trash2} onClick={() => onDelete(b)} aria-label={`Supprimer ${b.name}`}>
          Supprimer
        </Button>
      </div>
    </article>
  );
}
