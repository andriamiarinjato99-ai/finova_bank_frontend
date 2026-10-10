import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { getErrorMessage } from '../../utils/errorHandler';

const schema = z.object({
  name: z.string().trim().min(2, 'Saisissez le nom du bénéficiaire.'),
  accountNumber: z.string().trim().min(4, 'Saisissez un numéro de compte valide.'),
  bank: z.string().trim().min(2, 'Saisissez le nom de la banque.'),
  active: z.boolean(),
});

export default function BeneficiaryForm({ open, initial, onClose, onSubmit }) {
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', accountNumber: '', bank: 'Finova', active: true },
  });

  useEffect(() => {
    if (open) {
      setError(null);
      reset({
        name: initial?.name ?? '',
        accountNumber: initial?.accountNumber ?? '',
        bank: initial?.bank ?? 'Finova',
        active: initial?.active ?? true,
      });
    }
  }, [open, initial, reset]);

  const submit = async (values) => {
    setError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Modifier le bénéficiaire' : 'Nouveau bénéficiaire'}>
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <Input label="Nom" autoComplete="off" error={errors.name?.message} {...register('name')} />
        <Input label="Numéro de compte" autoComplete="off" hint="Numéro complet du compte Finova du destinataire (Comptes, Voir les détails)." error={errors.accountNumber?.message} {...register('accountNumber')} />
        <Input label="Banque" autoComplete="off" error={errors.bank?.message} {...register('bank')} />
        <label className="flex min-h-[44px] items-center gap-3 text-sm font-semibold">
          <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-primary" {...register('active')} />
          Bénéficiaire actif
        </label>
        {error && <Alert tone="error" title="Enregistrement impossible">{error}</Alert>}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button type="submit" loading={isSubmitting}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}
