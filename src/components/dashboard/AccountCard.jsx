import { Link } from 'react-router-dom';
import { ACCOUNT_TYPE_LABELS, labelFor, maskAccountNumber } from '../../utils/formatAmount';
import { formatMoney } from '../../utils/currency';
import StatusBadge from '../common/StatusBadge';

export default function AccountCard({ account }) {
  return (
    <Link to="/app/accounts" className="card block p-4 transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{account.name ?? labelFor(ACCOUNT_TYPE_LABELS, account.type, 'Compte')}</p>
          <p className="text-sm muted">{maskAccountNumber(account.number)}</p>
        </div>
        <StatusBadge status={account.status} />
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight">{formatMoney(account.balance, account.currency)}</p>
    </Link>
  );
}
