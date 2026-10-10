import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';
import { useFinanceStore } from '../../store/financeStore';
import { toast } from '../../store/toastStore';
import { getErrorMessage } from '../../utils/errorHandler';
import { formatMoney } from '../../utils/currency';
import { maskAccountNumber, parseAmount, toApiAmount, toId } from '../../utils/formatAmount';

const schema = z.object({
  account_id: z.string().min(1, 'Choisissez un compte.'),
  amount: z
    .string()
    .min(1, 'Saisissez un montant.')
    .refine((v) => parseAmount(v) > 0, 'Le montant doit être supérieur à 0.'),
  description: z.string().max(200, '200 caractères maximum.').optional(),
});

const COPY = {
  deposit: { title: 'Faire un dépôt', verb: 'Déposer', done: 'Dépôt effectué', defaultDescription: 'Dépôt', intro: 'Dépôt simulé : le solde est modifié dans la base de démonstration du backend.' },
  withdraw: { title: 'Faire un retrait', verb: 'Retirer', done: 'Retrait effectué', defaultDescription: 'Retrait', intro: 'Le backend vérifie que le solde est suffisant avant d’accepter le retrait.' },
};

export default function OperationModal({ open, kind = 'deposit', onClose }) {
  const copy = COPY[kind];
  const accounts = useFinanceStore((s) => s.accounts);
  const deposit = useFinanceStore((s) => s.deposit);
  const withdraw = useFinanceStore((s) => s.withdraw);
  const [step, setStep] = useState('form');
  const [pending, setPending] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { account_id: '', amount: '', description: '' },
  });

  useEffect(() => {
    if (open) {
      setStep('form');
      setPending(null);
      setError(null);
      reset({ account_id: accounts[0] ? String(accounts[0].id) : '', amount: '', description: copy.defaultDescription });
    }
  }, [open, kind, accounts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const account = pending && accounts.find((a) => String(a.id) === pending.account_id);

  const onValid = (values) => {
    setPending(values);
    setError(null);
    setStep('confirm');
  };

  const confirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        account_id: toId(pending.account_id),
        amount: toApiAmount(pending.amount),
        description: pending.description || copy.defaultDescription,
      };
      await (kind === 'deposit' ? deposit(payload) : withdraw(payload));
      toast.success(`${copy.done} — vos comptes ont été actualisés.`);
      onClose();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={copy.title}>
      {step === 'form' ? (
        <form onSubmit={handleSubmit(onValid)} noValidate className="space-y-4">
          <p className="text-sm muted">{copy.intro}</p>
          {accounts.length === 0 && <Alert tone="warning">Aucun compte disponible. Chargez vos comptes avant de continuer.</Alert>}
          <Select label="Compte" error={errors.account_id?.message} {...register('account_id')}>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name ?? 'Compte'} {maskAccountNumber(a.number)} — {formatMoney(a.balance, a.currency)}
              </option>
            ))}
          </Select>
          <Input label="Montant" inputMode="decimal" autoComplete="off" placeholder="0,00" error={errors.amount?.message} {...register('amount')} />
          <Input label="Description (facultatif)" error={errors.description?.message} {...register('description')} />
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={accounts.length === 0}>Continuer</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm">Vérifiez les informations avant de confirmer :</p>
          <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 px-4 dark:divide-slate-800 dark:border-slate-800">
            <div className="flex justify-between py-2.5 text-sm"><dt className="muted">Opération</dt><dd className="font-semibold">{copy.verb}</dd></div>
            <div className="flex justify-between py-2.5 text-sm"><dt className="muted">Compte</dt><dd className="font-semibold">{maskAccountNumber(account?.number)}</dd></div>
            <div className="flex justify-between py-2.5 text-sm"><dt className="muted">Montant</dt><dd className="font-extrabold">{formatMoney(parseAmount(pending.amount), account?.currency)}</dd></div>
            <div className="flex justify-between py-2.5 text-sm"><dt className="muted">Description</dt><dd className="font-semibold">{pending.description || copy.defaultDescription}</dd></div>
          </dl>
          {error && <Alert tone="error" title="L'opération n'a pas été effectuée">{error}</Alert>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setStep('form')} disabled={submitting}>Modifier</Button>
            <Button onClick={confirm} loading={submitting}>Confirmer</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
