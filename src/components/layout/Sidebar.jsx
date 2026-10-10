import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import { NAV_GROUPS } from './navItems';
import { useDemoStore } from '../../store/demoStore';

export function SidebarContent({ onNavigate }) {
  const unread = useDemoStore((s) => s.notifications.filter((n) => !n.read).length);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <div className="px-2 pt-1">
        <Logo to="/app" />
      </div>
      <nav aria-label="Navigation principale" className="flex flex-col gap-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-xs font-semibold muted">{group.label}</p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map(({ to, label, icon: Icon, end, badge }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    {badge && unread > 0 && (
                      <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-bold text-white">
                        {unread}
                        <span className="sr-only"> non lues</span>
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block 3xl:w-72">
      <div className="sticky top-0 h-screen">
        <SidebarContent />
      </div>
    </aside>
  );
}
