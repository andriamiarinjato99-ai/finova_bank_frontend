import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';
import Alert from '../common/Alert';
import { createAccount } from '../../services/accountService';
import { useFinanceStore } from '../../store/financeStore';
import { toast } from '../../store/toastStore';
import { getErrorMessage } from '../../utils/errorHandler';

const TYPES = [
  ['CURRENT', 'Compte courant'],
  ['SAVINGS', 'Compte épargne'],
];
const CURRENCY_OPTIONS = ['MGA', 'EUR', 'USD'];

/** Ouverture d'un compte supplémentaire : le serveur attribue le numéro, l'agence et le propriétaire. */
export default function OpenAccountModal({ open, onClose }) {
  const fetchAccounts = useFinanceStore((s) => s.fetchAccounts);
  const [type, setType] = useState('CURRENT');
  const [currency, setCurrency] = useState('MGA');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setType('CURRENT');
      setCurrency('MGA');
      setError(null);
    }
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createAccount({ account_type: type, currency });
      await fetchAccounts();
      toast.success('Votre nouveau compte est ouvert.');
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'ouvrir le compte."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ouvrir un compte">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm muted">Le numéro de compte est attribué automatiquement. Le solde de départ est de 0.</p>
        <Select label="Type de compte" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Select label="Devise" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        {error && <Alert tone="error" title="Ouverture impossible">{error}</Alert>}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Annuler</Button>
          <Button type="submit" loading={submitting}>Ouvrir le compte</Button>
        </div>
      </form>
    </Modal>
  );
}
