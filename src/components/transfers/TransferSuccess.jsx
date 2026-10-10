import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import { formatMoney } from '../../utils/currency';
import { parseAmount } from '../../utils/formatAmount';

export default function TransferSuccess({ source, destination, values, reference, onReset }) {
  return (
    <div className="flex flex-col items-center py-6 text-center" role="status">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-2xl font-extrabold">Virement effectué</h2>
      <p className="mt-2 max-w-sm text-sm muted">
        {formatMoney(parseAmount(values.amount), source.currency)} envoyés à {destination.label}. Vos comptes ont été actualisés depuis le serveur.
      </p>
      {reference && <p className="mt-2 text-sm">Référence : <span className="font-bold">{reference}</span></p>}
      <div className="mt-6 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Link to="/app/transactions" className="btn btn-secondary">Voir les transactions</Link>
        <Button onClick={onReset}>Nouveau virement</Button>
      </div>
    </div>
  );
}
