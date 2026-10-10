import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileSidebar from './MobileSidebar';

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="flex min-h-screen">
      <a href="#main" className="skip-link">
        Aller au contenu principal
      </a>
      <Sidebar />
      <MobileSidebar open={menuOpen} onClose={closeMenu} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none sm:px-6 sm:py-8 3xl:max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
