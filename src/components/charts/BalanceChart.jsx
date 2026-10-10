import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useThemeStore } from '../../store/themeStore';
import { formatMoney } from '../../utils/currency';

/** Graphique des transactions : dépôts, retraits et virements par mois (dérivé de l'API). */
export default function BalanceChart({ data, currency }) {
  const dark = useThemeStore((s) => s.resolved) === 'dark';
  const axis = dark ? '#94A3B8' : '#64748B';
  const grid = dark ? '#334155' : '#E2E8F0';

  return (
    <div
      role="img"
      aria-label={`Graphique en barres : dépôts, retraits et virements par mois. ${data
        .map((d) => `${d.label} : dépôts ${formatMoney(d.deposits, currency)}, retraits ${formatMoney(d.withdrawals, currency)}, virements ${formatMoney(d.transfers, currency)}`)
        .join(' ; ')}`}
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(v)} />
          <Tooltip
            formatter={(v) => formatMoney(v, currency)}
            contentStyle={{ background: dark ? '#0F172A' : '#fff', border: `1px solid ${grid}`, borderRadius: 12, color: dark ? '#F1F5F9' : '#111827' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: axis }} />
          <Bar dataKey="deposits" name="Dépôts" fill="#22C55E" radius={[6, 6, 0, 0]} />
          <Bar dataKey="withdrawals" name="Retraits" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          <Bar dataKey="transfers" name="Virements envoyés" fill="#635BFF" radius={[6, 6, 0, 0]} />
          <Bar dataKey="received" name="Virements reçus" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
