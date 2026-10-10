import { monthKey, monthLabel } from './formatDate';

const INEFFECTIVE = ['FAILED', 'CANCELLED', 'REJECTED'];
export const isEffective = (t) => !INEFFECTIVE.includes(String(t.status).toUpperCase());

/** Regroupe les transactions chargées par mois (6 derniers mois présents). */
export function groupByMonth(transactions, currency) {
  const map = new Map();
  transactions.filter(isEffective).forEach((t) => {
    if (currency && t.currency && t.currency !== currency) return;
    const key = monthKey(t.date);
    if (!key) return;
    const row = map.get(key) ?? { key, label: monthLabel(key), deposits: 0, withdrawals: 0, transfers: 0, received: 0 };
    if (t.type === 'DEPOSIT') row.deposits += t.amount;
    else if (t.type === 'WITHDRAW') row.withdrawals += t.amount;
    else if (t.type === 'TRANSFER') {
      // Virement reçu = entrée d'argent ; entre ses propres comptes = neutre ; sinon = sortie.
      if (t.direction === 'IN') row.received += t.amount;
      else if (t.direction !== 'INTERNAL') row.transfers += t.amount;
    }
    map.set(key, row);
  });
  return [...map.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-6)
    .map((r) => ({ ...r, spending: r.withdrawals + r.transfers }));
}

export function currentMonthFlow(transactions, currency) {
  const key = monthKey(new Date());
  const row = groupByMonth(transactions, currency).find((r) => r.key === key);
  return { income: (row?.deposits ?? 0) + (row?.received ?? 0), expenses: row?.spending ?? 0 };
}

export function totalsByCurrency(accounts) {
  const map = new Map();
  accounts.forEach((a) => map.set(a.currency, (map.get(a.currency) ?? 0) + a.balance));
  return [...map.entries()].map(([currency, total]) => ({ currency, total }));
}
