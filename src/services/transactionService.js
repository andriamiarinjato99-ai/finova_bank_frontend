import api from './api';

/**
 * Correspondance filtre UI -> paramètre d'API (django-filter).
 * Vérifiez les noms dans /api/docs/ et ajustez ici si besoin.
 */
export const FILTER_PARAMS = {
  search: 'search',
  type: 'transaction_type',
  status: 'status',
  currency: 'currency',
  dateFrom: 'date_from',
  dateTo: 'date_to',
  minAmount: 'min_amount',
  maxAmount: 'max_amount',
};

const SORT_FIELDS = { date: 'created_at', amount: 'amount' };

export function buildTransactionParams({ filters = {}, page = 1, sort } = {}) {
  const params = { page };
  Object.entries(FILTER_PARAMS).forEach(([key, apiKey]) => {
    const value = filters[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') params[apiKey] = String(value).trim();
  });
  if (sort?.field && SORT_FIELDS[sort.field]) {
    params.ordering = `${sort.dir === 'asc' ? '' : '-'}${SORT_FIELDS[sort.field]}`;
  }
  return params;
}

/**
 * Filtrage/tri de sécurité côté client sur la page reçue : sans effet si l'API
 * applique déjà les filtres, utile si certains paramètres ne sont pas supportés.
 */
export function applyLocalFilters(items, filters = {}, sort) {
  const text = (filters.search ?? '').toLowerCase().trim();
  const min = filters.minAmount !== '' && filters.minAmount != null ? Number(filters.minAmount) : null;
  const max = filters.maxAmount !== '' && filters.maxAmount != null ? Number(filters.maxAmount) : null;
  let out = items.filter((t) => {
    if (filters.type && t.type !== filters.type) return false;
    if (filters.status && String(t.status).toUpperCase() !== filters.status) return false;
    if (filters.currency && t.currency && t.currency !== filters.currency) return false;
    if (filters.dateFrom && t.date && String(t.date).slice(0, 10) < filters.dateFrom) return false;
    if (filters.dateTo && t.date && String(t.date).slice(0, 10) > filters.dateTo) return false;
    if (min != null && Number.isFinite(min) && t.amount < min) return false;
    if (max != null && Number.isFinite(max) && t.amount > max) return false;
    if (text) {
      const hay = `${t.reference} ${t.description} ${t.sourceNumber ?? ''} ${t.destinationNumber ?? ''}`.toLowerCase();
      if (!hay.includes(text)) return false;
    }
    return true;
  });
  if (sort?.field) {
    const dir = sort.dir === 'asc' ? 1 : -1;
    out = [...out].sort((a, b) => {
      if (sort.field === 'amount') return (a.amount - b.amount) * dir;
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    });
  }
  return out;
}

export const getTransactions = (params) => api.get('/transactions/', { params });
export const getTransaction = (id) => api.get(`/transactions/${id}/`);
export const makeDeposit = (data) => api.post('/transactions/deposit/', data);
export const makeWithdraw = (data) => api.post('/transactions/withdraw/', data);
export const makeTransfer = (data) => api.post('/transactions/transfer/', data);
