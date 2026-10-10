import { Lock, LockOpen, Eye } from 'lucide-react';
import Button from '../common/Button';
import DemoBadge from '../common/DemoBadge';

/** Carte entièrement fictive : aucun numéro réel, aucun appel backend. */
export default function VirtualCard({ card, holder, onToggle, onDetails }) {
  const blocked = card.status === 'BLOCKED';
  return (
    <article className="w-full max-w-sm" aria-label={`${card.brand}, carte de démonstration se terminant par ${card.last4}, ${blocked ? 'bloquée' : 'active'}`}>
      <div
        className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl p-5 text-white shadow-lift ${
          blocked ? 'bg-slate-600' : 'bg-gradient-to-br from-primary via-indigo-600 to-slate-900'
        }`}
      >
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" />
        <div className="flex items-center justify-between text-sm font-extrabold tracking-wide">
          <span>FINOVA</span>
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs">{card.brand.replace('Finova ', '')}</span>
        </div>
        <p className="mt-8 font-mono text-lg tracking-widest sm:text-xl" aria-hidden="true">•••• •••• •••• {card.last4}</p>
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-sm font-semibold">
          <span className="truncate pr-3">{holder}</span>
          <span>{card.expiry}</span>
        </div>
        {blocked && (
          <span className="absolute right-5 top-12 inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 text-xs font-bold">
            <Lock className="h-3 w-3" aria-hidden="true" /> BLOQUÉE
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DemoBadge label="Carte de démonstration" />
        <span className="badge badge-neutral">{blocked ? 'Bloquée (local)' : 'Active (local)'}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" icon={blocked ? LockOpen : Lock} onClick={() => onToggle(card.id)}>
          {blocked ? 'Débloquer' : 'Bloquer'}
        </Button>
        <Button variant="secondary" size="sm" icon={Eye} onClick={() => onDetails(card)}>
          Voir les détails
        </Button>
      </div>
    </article>
  );
}
