import { maskAccountNumber } from '../../utils/formatAmount';

/** Libellé masqué d'un compte à partir d'un numéro ou d'un id (retrouvé dans la liste des comptes). */
export function accountLabel(number, id, accounts = []) {
  if (number) return maskAccountNumber(number);
  if (id != null) {
    const found = accounts.find((a) => String(a.id) === String(id));
    if (found) return maskAccountNumber(found.number);
  }
  return '—';
}
