import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, MapPin, Pencil, Phone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useFinanceStore } from '../../store/financeStore';
import { updateClient } from '../../services/clientService';
import { normalizeClient } from '../../utils/normalize';
import { getErrorMessage } from '../../utils/errorHandler';
import { formatDate } from '../../utils/formatDate';
import { toast } from '../../store/toastStore';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { initials } from '../../utils/normalize';

const schema = z.object({
  email: z.string().trim().email('Saisissez une adresse e-mail valide.').or(z.literal('')),
  phone: z.string().trim().max(30, '30 caractères maximum.'),
  address: z.string().trim().max(200, '200 caractères maximum.'),
});

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const loadClient = useAuthStore((s) => s.loadClient);
  const setClient = useAuthStore((s) => s.setClient);
  const accounts = useFinanceStore((s) => s.accounts);
  const agencies = useFinanceStore((s) => s.agencies);
  const fetchAccounts = useFinanceStore((s) => s.fetchAccounts);
  const client = user?.client;

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!client) loadClient();
    if (accounts.length === 0) fetchAccounts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const agencyId = client?.agencyId ?? accounts[0]?.agencyId;
  const agency = agencies.find((a) => String(a.id) === String(agencyId));

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', phone: '', address: '' },
  });

  const openEdit = () => {
    reset({ email: client?.email ?? '', phone: client?.phone ?? '', address: client?.address ?? '' });
    setError(null);
    setOpen(true);
  };

  const submit = async (values) => {
    setError(null);
    try {
      const { data } = await updateClient(client.id, values);
      setClient(normalizeClient(data));
      toast.success('Profil mis à jour.');
      setOpen(false);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const name = client?.fullName || user?.username || 'Utilisateur';

  return (
    <div className="space-y-6">
      <h1 className="page-title">Profil</h1>

      <section className="card p-5 sm:p-6" aria-labelledby="client-title">
        {!client ? (
          <>
            <h2 id="client-title" className="sr-only">Informations personnelles</h2>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white" aria-hidden="true">{initials(name)}</span>
              <div>
                <p className="text-lg font-extrabold">{name}</p>
                <p className="text-sm muted">Identifiant : {user?.username}</p>
              </div>
            </div>
            <div className="mt-4"><Alert tone="info">Aucune fiche client n'a pu être chargée depuis /api/clients/. Seul votre identifiant de connexion est disponible.</Alert></div>
            <LoadingSpinner label="Recherche de votre fiche client…" className="py-4" />
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white" aria-hidden="true">{initials(name)}</span>
                <div>
                  <h2 id="client-title" className="text-lg font-extrabold">{name}</h2>
                  <p className="text-sm muted">Identifiant : {user?.username}{client.createdAt ? ` · Client depuis le ${formatDate(client.createdAt)}` : ''}</p>
                </div>
              </div>
              <Button variant="secondary" icon={Pencil} onClick={openEdit}>Modifier</Button>
            </div>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {[[Mail, 'E-mail', client.email], [Phone, 'Téléphone', client.phone], [MapPin, 'Adresse', client.address]].map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <Icon className="mt-0.5 h-4 w-4 muted" aria-hidden="true" />
                  <div><dt className="text-xs muted">{label}</dt><dd className="text-sm font-semibold">{value || 'Non renseigné'}</dd></div>
                </div>
              ))}
            </dl>
          </>
        )}
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="agency-title">
        <h2 id="agency-title" className="flex items-center gap-2 text-lg font-bold"><Building2 className="h-5 w-5 text-primary" aria-hidden="true" /> Mon agence</h2>
        {agency ? (
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="font-bold text-base">{agency.name}</div>
            {(agency.address || agency.city) && <div className="muted">{[agency.address, agency.city].filter(Boolean).join(', ')}</div>}
            {agency.phone && <div>Tél. {agency.phone}</div>}
            {agency.email && <div>{agency.email}</div>}
          </dl>
        ) : (
          <p className="mt-2 text-sm muted">Aucune agence n'est associée à votre profil pour le moment.</p>
        )}
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Modifier mes informations">
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <Input label="E-mail" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <Input label="Téléphone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
          <Input label="Adresse" autoComplete="street-address" error={errors.address?.message} {...register('address')} />
          {error && <Alert tone="error" title="Mise à jour impossible">{error}</Alert>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" loading={isSubmitting}>Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
