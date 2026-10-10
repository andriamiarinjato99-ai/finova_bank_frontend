import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { formatMoney } from '../../utils/currency';
import { formatDateTime } from '../../utils/formatDate';
import { TRANSACTION_TYPE_LABELS, labelFor } from '../../utils/formatAmount';
import { accountLabel } from './accountLabel';

export default function TransactionDetails({ transaction: t, accounts, onClose }) {
  if (!t) return null;
  const rows = [
    ['Référence', t.reference],
    ['Type', labelFor(TRANSACTION_TYPE_LABELS, t.type, 'Transaction')],
    ['Date', formatDateTime(t.date)],
    ['Montant', formatMoney(t.amount, t.currency ?? accounts[0]?.currency ?? 'EUR')],
    ['Devise', t.currency ?? accounts[0]?.currency ?? '—'],
    ['Compte source', t.type === 'DEPOSIT' ? '—' : accountLabel(t.sourceNumber, t.sourceId, accounts)],
    ['Compte destination', t.type === 'WITHDRAW' ? '—' : accountLabel(t.destinationNumber, t.destinationId, accounts)],
    ['Description', t.description || '—'],
  ];

  return (
    <Modal open onClose={onClose} title="Détail de la transaction" footer={<Button variant="secondary" onClick={onClose}>Fermer</Button>}>
      <dl className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="muted">{k}</dt>
            <dd className="text-right font-semibold">{v}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
          <dt className="muted">Statut</dt>
          <dd><StatusBadge status={t.status} /></dd>
        </div>
      </dl>
    </Modal>
  );
}
