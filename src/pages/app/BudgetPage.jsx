import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDemoStore } from '../../store/demoStore';
import { useThemeStore } from '../../store/themeStore';
import { formatMoney } from '../../utils/currency';
import ProgressBar from '../../components/common/ProgressBar';
import DemoBadge from '../../components/common/DemoBadge';

export default function BudgetPage() {
  const budgets = useDemoStore((s) => s.budgets);
  const dark = useThemeStore((s) => s.resolved) === 'dark';
  const axis = dark ? '#94A3B8' : '#64748B';
  const grid = dark ? '#334155' : '#E2E8F0';

  const data = budgets.map((b) => ({ category: b.category, Dépensé: b.spent, Plafond: b.limit }));
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Budget</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <DemoBadge />
          <span className="text-sm muted">Le backend n'a pas encore de modèle de budget.</span>
        </div>
      </div>

      <section className="card p-5" aria-label="Résumé du budget">
        <p className="text-sm font-semibold muted">Total dépensé ce mois (démonstration)</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">
          {formatMoney(totalSpent, 'EUR')} <span className="text-base font-semibold muted">/ {formatMoney(totalLimit, 'EUR')}</span>
        </p>
        <div className="mt-3"><ProgressBar value={totalSpent} max={totalLimit} label="Part du budget total dépensée" /></div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <ul className="space-y-3">
          {budgets.map((b) => {
            const pct = Math.round((b.spent / b.limit) * 100);
            const tone = pct >= 100 ? 'danger' : pct >= 90 ? 'warning' : 'primary';
            return (
              <li key={b.id} className="card p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-base font-bold">{b.category}</h2>
                  <p className="text-sm font-semibold">{formatMoney(b.spent, 'EUR')} / {formatMoney(b.limit, 'EUR')}</p>
                </div>
                <div className="mt-3"><ProgressBar value={b.spent} max={b.limit} tone={tone} label={`Budget ${b.category}`} /></div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-semibold">{pct} %</span>
                  <span className={tone === 'primary' ? 'muted' : 'font-semibold text-amber-700 dark:text-amber-300'}>
                    {b.limit - b.spent >= 0 ? `${formatMoney(b.limit - b.spent, 'EUR')} disponibles` : `Dépassement de ${formatMoney(b.spent - b.limit, 'EUR')}`}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <section className="card p-4 sm:p-5" aria-labelledby="budget-chart">
          <h2 id="budget-chart" className="text-lg font-bold">Dépensé et plafond par catégorie</h2>
          <div role="img" aria-label={`Graphique en barres : ${data.map((d) => `${d.category}, dépensé ${d.Dépensé} euros sur ${d.Plafond}`).join(' ; ')}`} className="mt-3 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                <XAxis type="number" tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" width={84} tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => formatMoney(v, 'EUR')} contentStyle={{ background: dark ? '#0F172A' : '#fff', border: `1px solid ${grid}`, borderRadius: 12, color: dark ? '#F1F5F9' : '#111827' }} />
                <Bar dataKey="Plafond" fill={dark ? '#334155' : '#CBD5E1'} radius={[0, 6, 6, 0]} />
                <Bar dataKey="Dépensé" radius={[0, 6, 6, 0]}>
                  {data.map((d) => <Cell key={d.category} fill={d.Dépensé >= d.Plafond ? '#EF4444' : '#635BFF'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
