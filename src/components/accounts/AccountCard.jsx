import { Building2, CalendarDays } from 'lucide-react';
import { ACCOUNT_TYPE_LABELS, labelFor, maskAccountLong } from '../../utils/formatAmount';
import { formatMoney } from '../../utils/currency';
import { formatDate } from '../../utils/formatDate';
import StatusBadge from '../common/StatusBadge';

export default function AccountCard({ account, onDetails }) {
  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold">{account.name ?? labelFor(ACCOUNT_TYPE_LABELS, account.type, 'Compte')}</h3>
          {account.name && account.type && <p className="text-xs muted">{labelFor(ACCOUNT_TYPE_LABELS, account.type)}</p>}
        </div>
        <StatusBadge status={account.status} />
      </div>
      <p className="mt-4 font-mono text-sm tracking-wider muted" aria-label={`Numéro de compte masqué, se terminant par ${String(account.number).slice(-4)}`}>
        {maskAccountLong(account.number)}
      </p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight">{formatMoney(account.balance, account.currency)}</p>
      <p className="text-xs font-semibold muted">{account.currency}</p>

      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Agence</dt>
          <Building2 className="h-4 w-4 muted" aria-hidden="true" />
          <dd>{account.agencyName ?? 'Agence non renseignée'}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Date d'ouverture</dt>
          <CalendarDays className="h-4 w-4 muted" aria-hidden="true" />
          <dd>Ouvert le {formatDate(account.openedAt)}</dd>
        </div>
      </dl>
      {onDetails && (
        <button type="button" onClick={() => onDetails(account)} className="btn btn-secondary mt-5 w-full">
          Voir les détails
        </button>
      )}
    </article>
  );
}
