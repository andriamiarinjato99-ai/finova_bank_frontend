import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatMoney } from '../../utils/currency';

export default function BalanceCard({ totals, income, expenses, flowCurrency }) {
  const [main, ...others] = totals;

  return (
    <section aria-labelledby="balance-title" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-700 p-6 text-white shadow-lift sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden="true" />
      <h2 id="balance-title" className="text-sm font-semibold text-white/80">
        Solde total
      </h2>
      <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {main ? formatMoney(main.total, main.currency) : '—'}
      </p>
      {others.length > 0 && (
        <p className="mt-1 text-sm text-white/80">
          {others.map((o) => formatMoney(o.total, o.currency)).join(' · ')} dans d'autres devises
        </p>
      )}
      <p className="mt-1 text-sm text-white/70">Données d'évolution indisponibles</p>

      <dl className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 p-3">
          <dt className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <ArrowDownLeft className="h-4 w-4" aria-hidden="true" /> Entrées du mois
          </dt>
          <dd className="mt-1 text-lg font-bold">{formatMoney(income, flowCurrency)}</dd>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <dt className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> Sorties du mois
          </dt>
          <dd className="mt-1 text-lg font-bold">{formatMoney(expenses, flowCurrency)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-white/70">Entrées et sorties calculées à partir des transactions chargées.</p>
    </section>
  );
}
