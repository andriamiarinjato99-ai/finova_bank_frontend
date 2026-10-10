import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { ACCOUNT_TYPE_LABELS, labelFor } from '../../utils/formatAmount';
import { formatMoney } from '../../utils/currency';
import { formatDate } from '../../utils/formatDate';
import { toast } from '../../store/toastStore';

export default function AccountDetails({ account, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!account) return null;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(String(account.number));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copie impossible : sélectionnez le numéro manuellement.');
    }
  };

  const rows = [
    ['Type', labelFor(ACCOUNT_TYPE_LABELS, account.type, '—')],
    ['Solde', formatMoney(account.balance, account.currency)],
    ['Devise', account.currency],
    ['Agence', account.agencyName ?? '—'],
    ["Date d'ouverture", formatDate(account.openedAt)],
  ];
  return (
    <Modal open onClose={onClose} title={account.name ?? 'Détails du compte'} footer={<Button variant="secondary" onClick={onClose}>Fermer</Button>}>
      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <p className="text-xs muted">Numéro de compte</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="select-all break-all font-mono text-sm font-bold tracking-wide">{account.number}</p>
          <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={copyNumber}>
            {copied ? 'Copié' : 'Copier'}
          </Button>
        </div>
      </div>
      <dl className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="muted">{k}</dt>
            <dd className="text-right font-semibold">{v}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between py-2.5 text-sm">
          <dt className="muted">Statut</dt>
          <dd><StatusBadge status={account.status} /></dd>
        </div>
      </dl>
      <p className="mt-3 text-xs muted">Communiquez ce numéro à la personne qui souhaite vous envoyer de l'argent.</p>
    </Modal>
  );
}
