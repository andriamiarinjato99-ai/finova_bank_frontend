import { create } from 'zustand';

let counter = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],
  push: (type, message) => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => get().dismiss(id), 5000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message) => useToastStore.getState().push('success', message),
  error: (message) => useToastStore.getState().push('error', message),
  info: (message) => useToastStore.getState().push('info', message),
};
