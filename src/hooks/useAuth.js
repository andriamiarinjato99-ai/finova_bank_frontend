import { useAuthStore } from '../store/authStore';
import { clientName } from '../utils/normalize';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  return { user, isAuthenticated, login, logout, displayName: clientName(user) };
}
