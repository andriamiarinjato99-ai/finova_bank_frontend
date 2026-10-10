import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuthStore } from '../store/authStore';

const LINKS = [
  { to: '/features', label: 'Fonctionnalités' },
  { to: '/pricing', label: 'Tarifs' },
  { to: '/security', label: 'Sécurité' },
  { to: '/help', label: 'Aide' },
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const linkCls = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'text-primary dark:text-indigo-300' : 'text-slate-600 hover:text-ink dark:text-slate-300 dark:hover:text-white'}`;

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Aller au contenu principal
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-night/90">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav aria-label="Navigation publique" className="ml-6 hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkCls}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/app" className="btn btn-primary">Mon espace</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">Connexion</Link>
                <Link to="/register" className="btn btn-primary hidden sm:inline-flex">Ouvrir un compte</Link>
              </>
            )}
            <button type="button" className="btn btn-ghost min-w-[44px] px-2 md:hidden" aria-expanded={open} aria-controls="public-menu" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen((o) => !o)}>
              {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="public-menu" aria-label="Menu mobile" className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 dark:border-slate-800 md:hidden">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={linkCls}>
                {l.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn btn-secondary">Connexion</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary">Ouvrir un compte</Link>
              </div>
            )}
          </nav>
        )}
      </header>

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm muted">
              Finova est un projet de démonstration. Aucune opération n'implique d'argent réel, et les cartes, témoignages et tarifs affichés sont fictifs.
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold">Produit</p>
            <ul className="space-y-1 text-sm muted">
              <li><Link to="/features" className="hover:underline">Fonctionnalités</Link></li>
              <li><Link to="/pricing" className="hover:underline">Tarifs</Link></li>
              <li><Link to="/security" className="hover:underline">Sécurité</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold">Assistance</p>
            <ul className="space-y-1 text-sm muted">
              <li><Link to="/help" className="hover:underline">Centre d'aide</Link></li>
              <li><Link to="/login" className="hover:underline">Connexion</Link></li>
              <li><Link to="/register" className="hover:underline">Ouvrir un compte</Link></li>
            </ul>
          </div>
        </div>
        <p className="border-t border-slate-200 px-4 py-4 text-center text-xs muted dark:border-slate-800">© {new Date().getFullYear()} Finova — démonstration</p>
      </footer>
    </div>
  );
}
