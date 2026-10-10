import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { totalsByCurrency } from '../utils/stats';

export function useAccounts() {
  const accounts = useFinanceStore((s) => s.accounts);
  const loading = useFinanceStore((s) => s.loading.accounts);
  const error = useFinanceStore((s) => s.errors.accounts);
  const fetchAccounts = useFinanceStore((s) => s.fetchAccounts);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { accounts, loading, error, refetch: fetchAccounts, totals: totalsByCurrency(accounts) };
}
