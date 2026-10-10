import api from './api';
import { unwrapList } from '../utils/normalize';

export const getAccounts = (params) => api.get('/accounts/', { params });
export const getAccount = (id) => api.get(`/accounts/${id}/`);
export const createAccount = (data) => api.post('/accounts/', data);
export const updateAccount = (id, data) => api.patch(`/accounts/${id}/`, data);

/** Suit la pagination DRF (next) pour récupérer tous les comptes. */
export async function getAllAccounts() {
  let page = 1;
  let all = [];
  for (;;) {
    const { data } = await getAccounts({ page });
    const { results, next } = unwrapList(data);
    all = all.concat(results);
    if (!next || page >= 20) break;
    page += 1;
  }
  return all;
}
