import { ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, Bell, Info, LogIn, PiggyBank, ShieldAlert } from 'lucide-react';
import { useDemoStore } from '../../store/demoStore';
import { formatDateTime } from '../../utils/formatDate';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

const ICONS = { transfer: ArrowLeftRight, credit: ArrowDownToLine, withdraw: ArrowUpFromLine, login: LogIn, card: ShieldAlert, savings: PiggyBank, info: Info };

export default function NotificationsPage() {
  const notifications = useDemoStore((s) => s.notifications);
  const markRead = useDemoStore((s) => s.markNotificationRead);
  const markAllRead = useDemoStore((s) => s.markAllRead);
  const clear = useDemoStore((s) => s.clearNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="mt-1 text-sm muted">Notifications locales à cet appareil · {unread} non lue{unread > 1 ? 's' : ''}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="secondary" onClick={markAllRead} disabled={unread === 0}>Tout marquer comme lu</Button>
          <Button variant="secondary" onClick={clear} disabled={notifications.length === 0}>Effacer</Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card"><EmptyState icon={Bell} title="Aucune notification" description="Vos alertes apparaîtront ici après vos prochaines opérations." /></div>
      ) : (
        <ul className="card divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map((n) => {
            const Icon = ICONS[n.kind] ?? Info;
            return (
              <li key={n.id}>
                <button type="button" onClick={() => markRead(n.id)} className="flex min-h-[64px] w-full items-start gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-dark dark:bg-primary/20 dark:text-indigo-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm ${n.read ? 'font-semibold' : 'font-extrabold'}`}>{n.title}</span>
                      {!n.read && <span className="badge badge-demo">Non lue</span>}
                      {n.demo && <span className="badge badge-neutral">Exemple</span>}
                    </span>
                    {n.message && <span className="mt-0.5 block text-sm muted">{n.message}</span>}
                    <span className="mt-1 block text-xs muted">{formatDateTime(n.date)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
