import { create } from 'zustand';
import { getAllAccounts } from '../services/accountService';
import { getAgencies } from '../services/agencyService';
import { getAllBeneficiaries, createBeneficiary, updateBeneficiary, deleteBeneficiary, toBeneficiaryPayload } from '../services/beneficiaryService';
import { getStatistics } from '../services/statisticsService';
import {
  applyLocalFilters,
  buildTransactionParams,
  getTransactions,
  makeDeposit,
  makeTransfer,
  makeWithdraw,
} from '../services/transactionService';
import {
  normalizeAccount,
  normalizeAgency,
  normalizeBeneficiary,
  normalizeStatistics,
  normalizeTransaction,
  unwrapList,
} from '../utils/normalize';
import { getErrorMessage } from '../utils/errorHandler';
import { formatMoney } from '../utils/currency';
import { useDemoStore } from './demoStore';

const emptyTransactions = { items: [], count: 0, next: null, previous: null, page: 1, pageSize: null };

const initial = {
  accounts: [],
  agencies: [],
  transactions: emptyTransactions,
  beneficiaries: [],
  statistics: null,
  lastQuery: {},
  loading: { accounts: false, transactions: false, beneficiaries: false, statistics: false },
  errors: { accounts: null, transactions: null, beneficiaries: null, statistics: null },
};

export const useFinanceStore = create((set, get) => {
  const setLoading = (key, value) => set((s) => ({ loading: { ...s.loading, [key]: value } }));
  const setError = (key, value) => set((s) => ({ errors: { ...s.errors, [key]: value } }));

  return {
    ...initial,

    fetchAccounts: async () => {
      setLoading('accounts', true);
      setError('accounts', null);
      try {
        const [rawAccounts, agencies] = await Promise.all([
          getAllAccounts(),
          getAgencies()
            .then(({ data }) => unwrapList(data).results.map(normalizeAgency))
            .catch(() => []), // les noms d'agence sont un bonus : ne bloque pas les comptes
        ]);
        const accounts = rawAccounts.map(normalizeAccount).map((a) => ({
          ...a,
          agencyName: a.agencyName ?? agencies.find((ag) => String(ag.id) === String(a.agencyId))?.name ?? null,
        }));
        set({ accounts, agencies });
      } catch (error) {
        setError('accounts', getErrorMessage(error, 'Impossible de charger vos comptes.'));
      } finally {
        setLoading('accounts', false);
      }
    },

    fetchTransactions: async (query) => {
      const q = query ?? get().lastQuery;
      set({ lastQuery: q });
      setLoading('transactions', true);
      setError('transactions', null);
      try {
        const { data } = await getTransactions(buildTransactionParams(q));
        const { results, count, next, previous } = unwrapList(data);
        const page = q.page ?? 1;
        const items = applyLocalFilters(results.map(normalizeTransaction), q.filters, q.sort);
        const prevSize = get().transactions.pageSize;
        const pageSize = page === 1 && next ? results.length : prevSize ?? (next ? results.length : null);
        set({ transactions: { items, count, next, previous, page, pageSize } });
      } catch (error) {
        setError('transactions', getErrorMessage(error, 'Impossible de charger les transactions.'));
      } finally {
        setLoading('transactions', false);
      }
    },

    fetchBeneficiaries: async () => {
      setLoading('beneficiaries', true);
      setError('beneficiaries', null);
      try {
        const raw = await getAllBeneficiaries();
        set({ beneficiaries: raw.map(normalizeBeneficiary) });
      } catch (error) {
        setError('beneficiaries', getErrorMessage(error, 'Impossible de charger vos bénéficiaires.'));
      } finally {
        setLoading('beneficiaries', false);
      }
    },

    fetchStatistics: async () => {
      setLoading('statistics', true);
      setError('statistics', null);
      try {
        const { data } = await getStatistics();
        set({ statistics: normalizeStatistics(data) });
      } catch (error) {
        setError('statistics', getErrorMessage(error, 'Impossible de charger les statistiques.'));
      } finally {
        setLoading('statistics', false);
      }
    },

    /** Après chaque opération : on relit TOUT depuis Django, on ne modifie jamais le solde localement. */
    refreshAll: async () => {
      const { fetchAccounts, fetchTransactions, fetchStatistics } = get();
      await Promise.all([fetchAccounts(), fetchTransactions(), fetchStatistics()]);
    },

    deposit: async (payload) => {
      const { data } = await makeDeposit(payload);
      useDemoStore.getState().addNotification({
        kind: 'credit',
        title: 'Votre compte a été crédité',
        message: `Dépôt de ${formatMoney(payload.amount, get().accounts.find((a) => String(a.id) === String(payload.account_id))?.currency)} enregistré.`,
      });
      await get().refreshAll();
      return data;
    },

    withdraw: async (payload) => {
      const { data } = await makeWithdraw(payload);
      useDemoStore.getState().addNotification({
        kind: 'withdraw',
        title: 'Retrait effectué',
        message: `Retrait de ${formatMoney(payload.amount, get().accounts.find((a) => String(a.id) === String(payload.account_id))?.currency)} enregistré.`,
      });
      await get().refreshAll();
      return data;
    },

    transfer: async (payload) => {
      const { data } = await makeTransfer(payload);
      useDemoStore.getState().addNotification({
        kind: 'transfer',
        title: 'Virement effectué',
        message: `Virement de ${formatMoney(payload.amount, get().accounts.find((a) => String(a.id) === String(payload.source_account_id))?.currency)} enregistré.`,
      });
      await get().refreshAll();
      return data;
    },

    addBeneficiary: async (values) => {
      await createBeneficiary(toBeneficiaryPayload(values));
      await get().fetchBeneficiaries();
    },
    editBeneficiary: async (id, values) => {
      await updateBeneficiary(id, toBeneficiaryPayload(values));
      await get().fetchBeneficiaries();
    },
    removeBeneficiary: async (id) => {
      await deleteBeneficiary(id);
      await get().fetchBeneficiaries();
    },

    reset: () => set({ ...initial }),
  };
});
