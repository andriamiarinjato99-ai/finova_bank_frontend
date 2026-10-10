import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../common/Button';
import Input from '../common/Input';
import { parseAmount } from '../../utils/formatAmount';

const schema = z.object({
  amount: z
    .string()
    .min(1, 'Saisissez un montant.')
    .refine((v) => parseAmount(v) > 0, 'Le montant doit être supérieur à 0.'),
  description: z.string().max(200, '200 caractères maximum.').optional(),
});

/** Étape 3 : montant, devise (celle du compte source, non modifiable) et description. */
export default function TransferForm({ currency, defaults, onBack, onNext }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: defaults?.amount ?? '', description: defaults?.description ?? 'Virement' },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-4">
      <Input label="Montant" inputMode="decimal" autoComplete="off" placeholder="0,00" error={errors.amount?.message} {...register('amount')} />
      <Input label="Devise" value={currency} readOnly hint="La devise est celle du compte source." />
      <Input label="Description (facultatif)" error={errors.description?.message} {...register('description')} />
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>Retour</Button>
        <Button type="submit">Voir le récapitulatif</Button>
      </div>
    </form>
  );
}
