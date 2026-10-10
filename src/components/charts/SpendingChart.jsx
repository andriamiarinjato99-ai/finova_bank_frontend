import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useThemeStore } from '../../store/themeStore';
import { formatMoney } from '../../utils/currency';

/** Dépenses = retraits + virements, dérivées des transactions chargées. */
export default function SpendingChart({ data, currency }) {
  const dark = useThemeStore((s) => s.resolved) === 'dark';
  const axis = dark ? '#94A3B8' : '#64748B';
  const grid = dark ? '#334155' : '#E2E8F0';

  return (
    <div
      role="img"
      aria-label={`Graphique en aires : dépenses par mois. ${data.map((d) => `${d.label} : ${formatMoney(d.spending, currency)}`).join(' ; ')}`}
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#635BFF" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(v)} />
          <Tooltip
            formatter={(v) => [formatMoney(v, currency), 'Dépenses']}
            contentStyle={{ background: dark ? '#0F172A' : '#fff', border: `1px solid ${grid}`, borderRadius: 12, color: dark ? '#F1F5F9' : '#111827' }}
          />
          <Area type="monotone" dataKey="spending" stroke="#635BFF" strokeWidth={2.5} fill="url(#spendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
