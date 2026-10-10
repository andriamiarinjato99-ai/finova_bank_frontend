import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PLANS } from '../../data/fallbackData';
import DemoBadge from '../../components/common/DemoBadge';

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="page-title">Tarifs</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DemoBadge label="Tarifs fictifs" />
        <p className="text-sm muted">Finova est un projet de démonstration : aucun paiement n'est demandé.</p>
      </div>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {PLANS.map((p) => (
          <li key={p.name} className={`card flex flex-col p-6 ${p.highlight ? 'border-primary ring-2 ring-primary/30' : ''}`}>
            <h2 className="text-lg font-bold">{p.name}{p.highlight && <span className="badge badge-demo ml-2">Le plus choisi</span>}</h2>
            <p className="mt-3 text-4xl font-extrabold tracking-tight">{p.price}<span className="ml-1 text-sm font-semibold muted">{p.period}</span></p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />{f}</li>)}
            </ul>
            <Link to="/register" className={`btn mt-6 ${p.highlight ? 'btn-primary' : 'btn-secondary'}`}>Choisir {p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
