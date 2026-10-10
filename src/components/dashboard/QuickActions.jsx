import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, Send } from 'lucide-react';

const base = 'card flex min-h-[72px] flex-col items-center justify-center gap-1.5 p-3 text-sm font-semibold transition-colors hover:border-primary';

export default function QuickActions({ onDeposit, onWithdraw }) {
  return (
    <section aria-label="Actions rapides" className="grid grid-cols-3 gap-3">
      <button type="button" onClick={onDeposit} className={base}>
        <ArrowDownToLine className="h-5 w-5 text-success" aria-hidden="true" />
        Dépôt
      </button>
      <button type="button" onClick={onWithdraw} className={base}>
        <ArrowUpFromLine className="h-5 w-5 text-warning" aria-hidden="true" />
        Retrait
      </button>
      <Link to="/app/transfer" className={base}>
        <Send className="h-5 w-5 text-primary" aria-hidden="true" />
        Virement
      </Link>
    </section>
  );
}
