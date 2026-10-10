import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_BUDGETS, DEMO_CARDS, DEMO_NOTIFICATIONS, DEMO_SAVINGS } from '../data/fallbackData';

let seq = 0;
const uid = (p) => `${p}-${Date.now()}-${++seq}`;

/**
 * Tout ce qui n'existe pas encore dans le backend (cartes, épargne, budget, notifications).
 * Données locales au navigateur : rien ici ne représente une opération bancaire réelle.
 */
export const useDemoStore = create(
  persist(
    (set) => ({
      cards: DEMO_CARDS,
      savings: DEMO_SAVINGS,
      budgets: DEMO_BUDGETS,
      notifications: DEMO_NOTIFICATIONS,

      toggleCard: (id) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' } : c)),
        })),

      addSavingsGoal: (name, target) =>
        set((s) => ({ savings: [...s.savings, { id: uid('goal'), name, saved: 0, target: Number(target) }] })),
      contributeToGoal: (id, amount) =>
        set((s) => ({
          savings: s.savings.map((g) => (g.id === id ? { ...g, saved: Math.min(g.target, g.saved + Number(amount)) } : g)),
        })),

      addNotification: ({ kind = 'info', title, message = '', demo = false }) =>
        set((s) => ({
          notifications: [
            { id: uid('n'), kind, title, message, date: new Date().toISOString(), read: false, demo },
            ...s.notifications,
          ].slice(0, 50),
        })),
      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      clearNotifications: () => set({ notifications: [] }),

      resetDemo: () =>
        set({ cards: DEMO_CARDS, savings: DEMO_SAVINGS, budgets: DEMO_BUDGETS, notifications: DEMO_NOTIFICATIONS }),
    }),
    { name: 'finova-demo' },
  ),
);
