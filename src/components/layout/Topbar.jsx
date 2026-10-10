import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { LogoMark } from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useDemoStore } from '../../store/demoStore';
import { initials } from '../../utils/normalize';

export default function Topbar({ onOpenMenu }) {
  const { displayName, logout } = useAuth();
  const navigate = useNavigate();
  const unread = useDemoStore((s) => s.notifications.filter((n) => !n.read).length);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/app/transactions?search=${encodeURIComponent(q)}` : '/app/transactions');
  };

  const onLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-slate-200 bg-white/90 px-3 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:gap-3 sm:px-6">
      <button type="button" onClick={onOpenMenu} className="btn btn-ghost min-h-[44px] min-w-[44px] px-2 lg:hidden" aria-label="Ouvrir le menu">
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <Link to="/app" className="lg:hidden" aria-label="Finova — tableau de bord">
        <LogoMark className="h-8 w-8" />
      </Link>

      <form onSubmit={onSearch} role="search" className="relative ml-1 hidden max-w-md flex-1 sm:block">
        <label htmlFor="global-search" className="sr-only">
          Rechercher une transaction
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une transaction"
          className="field-input pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Link to="/app/transactions" className="btn btn-ghost min-h-[44px] min-w-[44px] px-2 sm:hidden" aria-label="Rechercher">
          <Search className="h-5 w-5" aria-hidden="true" />
        </Link>
        <ThemeToggle />
        <Link to="/app/notifications" className="btn btn-ghost relative min-h-[44px] min-w-[44px] px-2" aria-label={`Notifications${unread ? `, ${unread} non lues` : ''}`}>
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unread > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-white dark:ring-slate-900" aria-hidden="true" />}
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex min-h-[44px] items-center gap-2 rounded-xl px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white" aria-hidden="true">
              {initials(displayName)}
            </span>
            <span className="hidden max-w-[10rem] truncate text-sm font-semibold md:block">{displayName}</span>
            <ChevronDown className="hidden h-4 w-4 md:block" aria-hidden="true" />
            <span className="sr-only">Menu du profil de {displayName}</span>
          </button>
          {menuOpen && (
            <div role="menu" aria-label="Profil" className="card absolute right-0 mt-2 w-56 p-1.5">
              <Link role="menuitem" to="/app/profile" onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                <User className="h-4 w-4" aria-hidden="true" /> Mon profil
              </Link>
              <Link role="menuitem" to="/app/settings" onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                <Settings className="h-4 w-4" aria-hidden="true" /> Paramètres
              </Link>
              <button type="button" role="menuitem" onClick={onLogout} className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
