import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import TransactionItem from '../transactions/TransactionItem';
import EmptyState from '../common/EmptyState';

export default function RecentTransactions({ transactions, accounts, onSelect }) {
  return (
    <section aria-labelledby="recent-title" className="card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 id="recent-title" className="text-lg font-bold">Transactions récentes</h2>
        <Link to="/app/transactions" className="text-sm font-semibold text-primary hover:underline dark:text-indigo-300">Tout voir</Link>
      </div>
      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title="Aucune transaction" description="Vos dépôts, retraits et virements apparaîtront ici." />
      ) : (
        <ul className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((t) => (
            <TransactionItem key={t.id} transaction={t} accounts={accounts} onClick={onSelect} />
          ))}
        </ul>
      )}
    </section>
  );
}
