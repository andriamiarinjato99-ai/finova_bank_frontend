import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';

/** query = { filters, page, sort } — recharge à chaque changement. */
export function useTransactions(query) {
  const transactions = useFinanceStore((s) => s.transactions);
  const loading = useFinanceStore((s) => s.loading.transactions);
  const error = useFinanceStore((s) => s.errors.transactions);
  const fetchTransactions = useFinanceStore((s) => s.fetchTransactions);
  const key = JSON.stringify(query ?? {});

  useEffect(() => {
    fetchTransactions(JSON.parse(key));
  }, [fetchTransactions, key]);

  return { ...transactions, loading, error, refetch: () => fetchTransactions(JSON.parse(key)) };
}
