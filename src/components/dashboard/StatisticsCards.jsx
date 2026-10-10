import { ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, Landmark, Receipt, Users, Wallet } from 'lucide-react';
import { formatMoney, formatNumber } from '../../utils/currency';

export default function StatisticsCards({ statistics, currency }) {
  const s = statistics;
  const items = [
    { label: 'Clients', value: formatNumber(s?.clients), icon: Users },
    { label: 'Comptes', value: formatNumber(s?.accounts), icon: Wallet },
    { label: 'Solde total', value: s?.totalBalance != null ? formatMoney(s.totalBalance, currency) : '—', icon: Landmark },
    { label: 'Transactions', value: formatNumber(s?.transactions), icon: Receipt },
    { label: 'Total dépôts', value: s?.deposits != null ? formatMoney(s.deposits, currency) : '—', icon: ArrowDownToLine },
    { label: 'Total retraits', value: s?.withdrawals != null ? formatMoney(s.withdrawals, currency) : '—', icon: ArrowUpFromLine },
    { label: 'Total virements', value: s?.transfers != null ? formatMoney(s.transfers, currency) : '—', icon: ArrowLeftRight },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="card p-4">
          <dt className="flex items-center gap-2 text-sm font-semibold muted">
            <Icon className="h-4 w-4 text-primary dark:text-indigo-300" aria-hidden="true" />
            {label}
          </dt>
          <dd className="mt-2 break-words text-xl font-extrabold tracking-tight">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
