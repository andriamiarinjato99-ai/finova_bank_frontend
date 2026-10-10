import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { formatMoney } from '../../utils/currency';
import { formatDateTime } from '../../utils/formatDate';
import { TRANSACTION_TYPE_LABELS, labelFor, transactionSign } from '../../utils/formatAmount';
import StatusBadge from '../common/StatusBadge';
import TransactionItem from './TransactionItem';
import { accountLabel } from './accountLabel';

function SortHeader({ field, sort, onSort, children, align = 'left' }) {
  const active = sort?.field === field;
  const Icon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ChevronUp : ChevronDown;
  return (
    <th scope="col" aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`px-3 py-3 text-${align}`}>
      <button type="button" onClick={() => onSort(field)} className="inline-flex min-h-[36px] items-center gap-1 font-semibold">
        {children}
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
    </th>
  );
}

export default function TransactionTable({ items, accounts, sort, onSort, onSelect }) {
  return (
    <>
      {/* Mobile : liste de cartes */}
      <ul className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
        {items.map((t) => (
          <TransactionItem key={t.id} transaction={t} accounts={accounts} onClick={onSelect} />
        ))}
      </ul>

      {/* Tablette / desktop : tableau */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">Liste des transactions</caption>
          <thead className="border-b border-slate-200 text-left text-xs muted dark:border-slate-800">
            <tr>
              <th scope="col" className="px-3 py-3 font-semibold">Référence</th>
              <SortHeader field="date" sort={sort} onSort={onSort}>Date</SortHeader>
              <th scope="col" className="px-3 py-3 font-semibold">Type</th>
              <th scope="col" className="px-3 py-3 font-semibold">Source</th>
              <th scope="col" className="px-3 py-3 font-semibold">Destination</th>
              <SortHeader field="amount" sort={sort} onSort={onSort} align="right">Montant</SortHeader>
              <th scope="col" className="px-3 py-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-3 py-3">
                  <button type="button" onClick={() => onSelect(t)} className="font-semibold text-primary hover:underline dark:text-indigo-300">
                    {t.reference}
                  </button>
                </td>
                <td className="whitespace-nowrap px-3 py-3">{formatDateTime(t.date)}</td>
                <td className="px-3 py-3">{labelFor(TRANSACTION_TYPE_LABELS, t.type, 'Transaction')}</td>
                <td className="px-3 py-3">{t.type === 'DEPOSIT' ? '—' : accountLabel(t.sourceNumber, t.sourceId, accounts)}</td>
                <td className="px-3 py-3">{t.type === 'WITHDRAW' ? '—' : accountLabel(t.destinationNumber, t.destinationId, accounts)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-bold">
                  {transactionSign(t)}
                  {formatMoney(t.amount, t.currency ?? accounts[0]?.currency ?? 'EUR')}
                </td>
                <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
