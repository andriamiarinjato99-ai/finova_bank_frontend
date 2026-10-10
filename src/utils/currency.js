export const CURRENCIES = ['EUR', 'USD', 'MGA'];

export function formatMoney(value, currency = 'EUR') {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'EUR',
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    const plain = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
    return `${plain} ${currency}`;
  }
}

export function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('fr-FR').format(n);
}
