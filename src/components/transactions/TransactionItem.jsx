import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import { formatMoney } from '../../utils/currency';
import { formatDateTime } from '../../utils/formatDate';
import { TRANSACTION_TYPE_LABELS, labelFor, transactionSign } from '../../utils/formatAmount';
import StatusBadge from '../common/StatusBadge';

const ICONS = { DEPOSIT: ArrowDownLeft, WITHDRAW: ArrowUpRight, TRANSFER: ArrowLeftRight };
const COLORS = {
  DEPOSIT: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  WITHDRAW: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  TRANSFER: 'bg-primary-soft text-primary-dark dark:bg-primary/20 dark:text-indigo-200',
};

export default function TransactionItem({ transaction: t, accounts = [], onClick }) {
  const Icon = ICONS[t.type] ?? ArrowLeftRight;
  const sign = transactionSign(t);
  const currency = t.currency ?? accounts[0]?.currency ?? 'EUR';

  return (
    <li>
      <button
        type="button"
        onClick={() => onClick?.(t)}
        className="flex min-h-[60px] w-full items-center gap-3 rounded-xl px-2 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60"
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${COLORS[t.type] ?? COLORS.TRANSFER}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">
            {labelFor(TRANSACTION_TYPE_LABELS, t.type, 'Transaction')}
            {t.description ? <span className="font-medium muted"> · {t.description}</span> : null}
          </span>
          <span className="block text-xs muted">{formatDateTime(t.date)}</span>
        </span>
        <span className="flex flex-col items-end gap-1">
          <span className="text-sm font-extrabold">
            {sign}
            {formatMoney(t.amount, currency)}
          </span>
          <StatusBadge status={t.status} />
        </span>
      </button>
    </li>
  );
}
