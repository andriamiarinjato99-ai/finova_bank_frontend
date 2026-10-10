import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';

export function useStatistics() {
  const statistics = useFinanceStore((s) => s.statistics);
  const loading = useFinanceStore((s) => s.loading.statistics);
  const error = useFinanceStore((s) => s.errors.statistics);
  const fetchStatistics = useFinanceStore((s) => s.fetchStatistics);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { statistics, loading, error, refetch: fetchStatistics };
}
