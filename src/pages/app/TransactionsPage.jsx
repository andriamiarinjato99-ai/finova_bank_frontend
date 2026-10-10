import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, Receipt } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import TransactionFilters, { EMPTY_FILTERS } from '../../components/transactions/TransactionFilters';
import TransactionTable from '../../components/transactions/TransactionTable';
import TransactionDetails from '../../components/transactions/TransactionDetails';
import OperationModal from '../../components/transactions/OperationModal';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function TransactionsPage() {
  const [params] = useSearchParams();
  const urlSearch = params.get('search') ?? '';
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, search: urlSearch });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' });
  const [selected, setSelected] = useState(null);
  const [operation, setOperation] = useState(null);

  // Recherche lancée depuis la barre du haut
  useEffect(() => {
    setFilters((f) => ({ ...f, search: urlSearch }));
    setPage(1);
  }, [urlSearch]);

  const { accounts } = useAccounts();
  const tx = useTransactions({ filters, page, sort });

  const onSort = (field) => {
    setSort((s) => (s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'desc' }));
    setPage(1);
  };
  const onApply = (values) => {
    setFilters(values);
    setPage(1);
  };
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="mt-1 text-sm muted">Historique de vos dépôts, retraits et virements.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="secondary" icon={ArrowDownToLine} onClick={() => setOperation('deposit')}>Dépôt</Button>
          <Button variant="secondary" icon={ArrowUpFromLine} onClick={() => setOperation('withdraw')}>Retrait</Button>
        </div>
      </div>

      <section className="card p-4 sm:p-5" aria-label="Filtres">
        <TransactionFilters key={urlSearch} values={filters} onApply={onApply} />
      </section>

      <section className="card p-2 sm:p-4" aria-live="polite">
        {tx.error ? (
          <ErrorState message={tx.error} onRetry={tx.refetch} />
        ) : tx.loading && tx.items.length === 0 ? (
          <LoadingSpinner label="Chargement des transactions…" />
        ) : tx.items.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={hasFilters ? 'Aucun résultat' : 'Aucune transaction'}
            description={hasFilters ? 'Aucune transaction ne correspond à vos filtres.' : 'Vos opérations apparaîtront ici.'}
          />
        ) : (
          <>
            <p className="px-2 pb-2 text-sm muted">{tx.count} transaction{tx.count > 1 ? 's' : ''}{tx.loading ? ' — actualisation…' : ''}</p>
            <TransactionTable items={tx.items} accounts={accounts} sort={sort} onSort={onSort} onSelect={setSelected} />
            <Pagination page={page} count={tx.count} pageSize={tx.pageSize} hasNext={Boolean(tx.next)} hasPrevious={Boolean(tx.previous) || page > 1} onChange={setPage} />
          </>
        )}
      </section>

      <TransactionDetails transaction={selected} accounts={accounts} onClose={() => setSelected(null)} />
      <OperationModal open={operation !== null} kind={operation ?? 'deposit'} onClose={() => setOperation(null)} />
    </div>
  );
}
