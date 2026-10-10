/**
 * Adaptateurs entre les réponses de l'API Django et les objets utilisés par l'UI.
 * Les noms de champs sont lus de façon tolérante : si votre serializer utilise
 * d'autres noms (voir /api/docs/), ajustez uniquement CE fichier.
 */
const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const first = (obj, keys) => {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return null;
};

export function unwrapList(data) {
  if (Array.isArray(data)) return { results: data, count: data.length, next: null, previous: null };
  const results = data?.results ?? [];
  return {
    results,
    count: data?.count ?? results.length,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  };
}

const idOf = (v) => (v && typeof v === 'object' ? v.id ?? null : v ?? null);

function accountRef(value, numberFallback) {
  if (value && typeof value === 'object') {
    return { id: value.id ?? null, number: first(value, ['account_number', 'number', 'iban']) ?? numberFallback ?? null };
  }
  if (typeof value === 'number') return { id: value, number: numberFallback ?? null };
  if (typeof value === 'string' && value) {
    return /^\d{1,7}$/.test(value)
      ? { id: value, number: numberFallback ?? null }
      : { id: null, number: numberFallback ?? value };
  }
  return { id: null, number: numberFallback ?? null };
}

export function normalizeAccount(a = {}) {
  return {
    id: a.id,
    name: first(a, ['name', 'label', 'title']),
    number: first(a, ['account_number', 'number', 'iban', 'account_no']) ?? '',
    type: first(a, ['account_type', 'type']),
    balance: num(a.balance) ?? 0,
    currency: a.currency || 'MGA',
    agencyId: idOf(a.agency),
    agencyName: first(a, ['agency_name']) ?? (a.agency && typeof a.agency === 'object' ? a.agency.name : null),
    status: a.status ?? (a.is_active === false ? 'INACTIVE' : 'ACTIVE'),
    openedAt: first(a, ['opened_at', 'opening_date', 'created_at', 'date_opened']),
    raw: a,
  };
}

export function normalizeTransaction(t = {}) {
  const src = accountRef(first(t, ['source_account', 'source', 'account']), first(t, ['source_account_number']));
  const dst = accountRef(first(t, ['destination_account', 'destination']), first(t, ['destination_account_number']));
  return {
    id: t.id,
    reference: first(t, ['reference', 'ref', 'transaction_id']) ?? (t.id != null ? `#${t.id}` : '—'),
    type: String(first(t, ['transaction_type', 'type']) ?? '').toUpperCase(),
    status: first(t, ['status']) ?? 'COMPLETED',
    amount: num(t.amount) ?? 0,
    currency: t.currency ?? null,
    date: first(t, ['created_at', 'date', 'timestamp', 'executed_at']),
    sourceId: src.id,
    sourceNumber: src.number,
    destinationId: dst.id,
    destinationNumber: dst.number,
    description: t.description ?? '',
    direction: t.direction ?? null,
    raw: t,
  };
}

export function normalizeBeneficiary(b = {}) {
  const accountCandidate = [b.account_id, b.linked_account_id, b.destination_account_id].find((v) => v != null);
  const nested = b.account && typeof b.account === 'object' ? b.account.id : typeof b.account === 'number' ? b.account : null;
  return {
    id: b.id,
    name: first(b, ['name', 'full_name', 'label']) ?? 'Bénéficiaire',
    accountNumber: first(b, ['account_number', 'iban', 'number']) ?? '',
    bank: first(b, ['bank_name', 'bank']) ?? '',
    active: b.is_active ?? b.active ?? true,
    accountId: accountCandidate ?? nested ?? null,
    raw: b,
  };
}

export function normalizeClient(c = {}) {
  const firstName = first(c, ['first_name', 'firstname']) ?? '';
  const lastName = first(c, ['last_name', 'lastname']) ?? '';
  const full = first(c, ['full_name', 'name']) ?? `${firstName} ${lastName}`.trim();
  return {
    id: c.id,
    username: c.username ?? c.user?.username ?? null,
    firstName,
    lastName,
    fullName: full,
    email: first(c, ['email']) ?? c.user?.email ?? '',
    phone: first(c, ['phone', 'phone_number', 'telephone']) ?? '',
    address: first(c, ['address', 'adresse']) ?? '',
    agencyId: idOf(c.agency),
    createdAt: first(c, ['created_at', 'joined_at', 'date_joined']),
    raw: c,
  };
}

export function normalizeAgency(a = {}) {
  return {
    id: a.id,
    name: first(a, ['name', 'label']) ?? 'Agence',
    address: first(a, ['address', 'adresse', 'location']) ?? '',
    city: first(a, ['city', 'ville']) ?? '',
    phone: first(a, ['phone', 'phone_number', 'telephone']) ?? '',
    email: first(a, ['email']) ?? '',
  };
}

export function normalizeStatistics(s = {}) {
  const src = { ...s, ...(s.totals || {}), ...(s.counts || {}) };
  const pick = (...keys) => num(first(src, keys));
  return {
    clients: pick('total_clients', 'clients_count', 'clients', 'nb_clients', 'client_count'),
    accounts: pick('total_accounts', 'accounts_count', 'accounts', 'nb_accounts', 'account_count'),
    totalBalance: pick('total_balance', 'balance_total', 'totalBalance', 'total_balances'),
    transactions: pick('total_transactions', 'transactions_count', 'transactions', 'nb_transactions'),
    deposits: pick('total_deposits', 'deposits_total', 'deposits', 'total_deposit', 'deposit_total'),
    withdrawals: pick('total_withdrawals', 'withdrawals_total', 'withdrawals', 'total_withdraw', 'withdraw_total'),
    transfers: pick('total_transfers', 'transfers_total', 'transfers', 'total_transfer', 'transfer_total'),
    raw: s,
  };
}

export function clientName(user) {
  const c = user?.client;
  return (c?.fullName || '').trim() || user?.username || 'Utilisateur';
}

export function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'F';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}
