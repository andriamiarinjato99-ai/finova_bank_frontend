import Alert from '../common/Alert';
import Button from '../common/Button';
import { formatMoney } from '../../utils/currency';
import { maskAccountNumber, parseAmount } from '../../utils/formatAmount';

/** Étape 4 : récapitulatif avant confirmation. Les frais sont fictifs (aucun frais n'est prélevé). */
export default function TransferSummary({ source, destination, values, error, submitting, onBack, onConfirm }) {
  const amount = parseAmount(values.amount);
  const fees = 0;
  const rows = [
    ['Bénéficiaire', destination.label],
    ['Compte source', `${source.name ?? 'Compte'} ${maskAccountNumber(source.number)}`],
    ['Montant', formatMoney(amount, source.currency)],
    ['Frais (fictifs)', formatMoney(fees, source.currency)],
  ];
  return (
    <div className="space-y-4">
      <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 px-4 dark:divide-slate-800 dark:border-slate-800">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="muted">{k}</dt>
            <dd className="text-right font-semibold">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 py-3 text-base">
          <dt className="font-bold">Total</dt>
          <dd className="font-extrabold">{formatMoney(amount + fees, source.currency)}</dd>
        </div>
        {values.description && (
          <div className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="muted">Description</dt>
            <dd className="text-right font-semibold">{values.description}</dd>
          </div>
        )}
      </dl>
      <p className="text-xs muted">Les frais affichés sont fictifs : le backend ne prélève aucun frais. Le solde est vérifié par le serveur au moment de la confirmation.</p>
      {error && <Alert tone="error" title="Le virement n'a pas été effectué">{error}</Alert>}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack} disabled={submitting}>Modifier</Button>
        <Button onClick={onConfirm} loading={submitting}>Confirmer le virement</Button>
      </div>
    </div>
  );
}
