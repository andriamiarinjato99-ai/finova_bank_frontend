/** Convertit une saisie utilisateur ("1 250,5") en nombre. */
export function parseAmount(value) {
  const n = Number(String(value ?? '').replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}

/** Chaîne décimale attendue par l'API ("1250.50"). */
export function toApiAmount(value) {
  const n = parseAmount(value);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
}

/** Les identifiants numériques restent des nombres, les autres (UUID) restent des chaînes. */
export function toId(value) {
  return /^\d+$/.test(String(value)) ? Number(value) : value;
}

export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/** "•••• 4821" — jamais le numéro complet. */
export function maskAccountNumber(number) {
  const s = String(number ?? '').replace(/\s/g, '');
  if (!s) return '•••• ••••';
  return `•••• ${s.slice(-4)}`;
}

export function maskAccountLong(number) {
  const s = String(number ?? '').replace(/\s/g, '');
  if (!s) return '•••• •••• •••• ••••';
  return `•••• •••• •••• ${s.slice(-4)}`;
}

export const TRANSACTION_TYPE_LABELS = {
  DEPOSIT: 'Dépôt',
  WITHDRAW: 'Retrait',
  TRANSFER: 'Virement',
};

export const STATUS_LABELS = {
  COMPLETED: 'Terminée',
  SUCCESS: 'Terminée',
  SUCCESSFUL: 'Terminée',
  PENDING: 'En attente',
  FAILED: 'Échouée',
  REJECTED: 'Refusée',
  CANCELLED: 'Annulée',
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  BLOCKED: 'Bloqué',
  FROZEN: 'Gelé',
  CLOSED: 'Clôturé',
  SUSPENDED: 'Suspendu',
};

export const ACCOUNT_TYPE_LABELS = {
  CHECKING: 'Compte courant',
  CURRENT: 'Compte courant',
  SAVINGS: 'Compte épargne',
  SAVING: 'Compte épargne',
  BUSINESS: 'Compte professionnel',
  JOINT: 'Compte joint',
};

export function labelFor(map, key, fallback) {
  if (!key) return fallback ?? '—';
  return map[String(key).toUpperCase()] ?? fallback ?? String(key);
}

export function statusTone(status) {
  const s = String(status ?? '').toUpperCase();
  if (['COMPLETED', 'SUCCESS', 'SUCCESSFUL', 'ACTIVE'].includes(s)) return 'success';
  if (['PENDING'].includes(s)) return 'warning';
  if (['FAILED', 'REJECTED', 'CANCELLED', 'BLOCKED', 'CLOSED', 'SUSPENDED', 'FROZEN'].includes(s)) return 'danger';
  return 'neutral';
}

/** Signe affiché devant un montant : crédit (+), débit (−) ou neutre (virement entre ses propres comptes). */
export function transactionSign(t) {
  if (t.type === 'DEPOSIT') return '+';
  if (t.type === 'WITHDRAW') return '−';
  if (t.type === 'TRANSFER') {
    if (t.direction === 'IN') return '+';
    if (t.direction === 'OUT') return '−';
  }
  return '';
}
