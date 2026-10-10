import { useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useStatistics } from '../../hooks/useStatistics';
import { useTransactions } from '../../hooks/useTransactions';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/themeStore';
import { currentMonthFlow, groupByMonth } from '../../utils/stats';
import BalanceCard from '../../components/dashboard/BalanceCard';
import AccountCard from '../../components/dashboard/AccountCard';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import StatisticsCards from '../../components/dashboard/StatisticsCards';
import BalanceChart from '../../components/charts/BalanceChart';
import SpendingChart from '../../components/charts/SpendingChart';
import TransactionDetails from '../../components/transactions/TransactionDetails';
import OperationModal from '../../components/transactions/OperationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const QUERY = { filters: {}, page: 1 };

export default function DashboardPage() {
  const { displayName } = useAuth();
  const { accounts, loading, error, refetch, totals } = useAccounts();
  const { statistics, error: statsError } = useStatistics();
  const tx = useTransactions(QUERY);
  useThemeStore((s) => s.resolved);
  const [operation, setOperation] = useState(null);
  const [selected, setSelected] = useState(null);

  if (loading && accounts.length === 0) return <LoadingSpinner label="Chargement de vos comptes…" />;
  if (error && accounts.length === 0) return <ErrorState message={error} onRetry={refetch} />;

  const mainCurrency = totals[0]?.currency ?? 'MGA';
  const flow = currentMonthFlow(tx.items, mainCurrency);
  const monthly = groupByMonth(tx.items, mainCurrency);
  const firstName = displayName.split(' ')[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Bonjour {firstName}</h1>
        <p className="mt-1 text-sm muted">Voici l'état de vos finances, lu en direct depuis le serveur.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <BalanceCard totals={totals} income={flow.income} expenses={flow.expenses} flowCurrency={mainCurrency} />
          <QuickActions onDeposit={() => setOperation('deposit')} onWithdraw={() => setOperation('withdraw')} />
        </div>
        <section aria-labelledby="accounts-title" className="space-y-3">
          <h2 id="accounts-title" className="text-lg font-bold">Mes comptes</h2>
          {accounts.length === 0 ? (
            <div className="card"><EmptyState icon={PiggyBank} title="Aucun compte" description="Ouvrez un compte depuis la page Comptes pour commencer." /></div>
          ) : (
            accounts.slice(0, 3).map((a) => <AccountCard key={a.id} account={a} />)
          )}
        </section>
      </div>

      <section aria-labelledby="stats-title" className="space-y-3">
        <h2 id="stats-title" className="text-lg font-bold">Statistiques</h2>
        {statsError ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{statsError}</p> : <StatisticsCards statistics={statistics} currency={mainCurrency} />}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-4 sm:p-5" aria-labelledby="chart-tx">
          <h2 id="chart-tx" className="text-lg font-bold">Transactions par mois</h2>
          <p className="mb-3 text-xs muted">Calculé à partir des transactions chargées.</p>
          {monthly.length === 0 ? <EmptyState title="Pas encore de données" description="Le graphique apparaîtra après vos premières transactions." /> : <BalanceChart data={monthly} currency={mainCurrency} />}
        </section>
        <section className="card p-4 sm:p-5" aria-labelledby="chart-spend">
          <h2 id="chart-spend" className="text-lg font-bold">Dépenses</h2>
          <p className="mb-3 text-xs muted">Retraits + virements, dérivés des transactions chargées.</p>
          {monthly.length === 0 ? <EmptyState title="Pas encore de données" description="Aucune dépense à afficher pour le moment." /> : <SpendingChart data={monthly} currency={mainCurrency} />}
        </section>
      </div>

      {tx.error ? (
        <ErrorState message={tx.error} onRetry={tx.refetch} />
      ) : tx.loading && tx.items.length === 0 ? (
        <LoadingSpinner label="Chargement des transactions…" />
      ) : (
        <RecentTransactions transactions={tx.items.slice(0, 5)} accounts={accounts} onSelect={setSelected} />
      )}

      <OperationModal open={operation !== null} kind={operation ?? 'deposit'} onClose={() => setOperation(null)} />
      <TransactionDetails transaction={selected} accounts={accounts} onClose={() => setSelected(null)} />
    </div>
  );
}
