import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Users } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useFinanceStore } from '../../store/financeStore';
import TransferForm from '../../components/transfers/TransferForm';
import TransferSummary from '../../components/transfers/TransferSummary';
import TransferSuccess from '../../components/transfers/TransferSuccess';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatMoney } from '../../utils/currency';
import { digitsOnly, maskAccountNumber, toApiAmount, toId } from '../../utils/formatAmount';
import { getErrorMessage } from '../../utils/errorHandler';
import { toast } from '../../store/toastStore';

const STEPS = ['Compte source', 'Destinataire', 'Montant', 'Récapitulatif', 'Confirmation'];

function RadioCard({ checked, disabled, onChange, name, title, subtitle, note }) {
  return (
    <label className={`flex min-h-[64px] cursor-pointer items-center gap-3 rounded-xl border p-3 ${checked ? 'border-primary bg-primary-soft dark:bg-primary/15' : 'border-slate-200 dark:border-slate-700'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
      <input type="radio" name={name} checked={checked} disabled={disabled} onChange={onChange} className="h-5 w-5 text-primary" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{title}</span>
        <span className="block text-sm muted">{subtitle}</span>
        {note && <span className="mt-0.5 block text-xs text-amber-700 dark:text-amber-300">{note}</span>}
      </span>
      {checked && <Check className="h-5 w-5 text-primary" aria-hidden="true" />}
    </label>
  );
}

export default function TransferPage() {
  const { accounts, loading, error, refetch } = useAccounts();
  const beneficiaries = useFinanceStore((s) => s.beneficiaries);
  const benLoading = useFinanceStore((s) => s.loading.beneficiaries);
  const fetchBeneficiaries = useFinanceStore((s) => s.fetchBeneficiaries);
  const transfer = useFinanceStore((s) => s.transfer);

  const [step, setStep] = useState(1);
  const [sourceId, setSourceId] = useState('');
  const [destTab, setDestTab] = useState('beneficiaries');
  const [destKey, setDestKey] = useState('');
  const [values, setValues] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [reference, setReference] = useState(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  useEffect(() => {
    if (!sourceId && accounts[0]) setSourceId(String(accounts[0].id));
  }, [accounts, sourceId]);

  const source = accounts.find((a) => String(a.id) === sourceId);

  // Destinations possibles : bénéficiaires (compte retrouvé par id ou par numéro) et autres comptes à soi.
  const destinations = useMemo(() => {
    const list = [];
    beneficiaries
      .filter((b) => b.active)
      .forEach((b) => {
        const byNumber = accounts.find((a) => digitsOnly(a.number) && digitsOnly(a.number) === digitsOnly(b.accountNumber));
        const accountId = b.accountId ?? byNumber?.id ?? null;
        list.push({
          key: `ben-${b.id}`,
          tab: 'beneficiaries',
          label: b.name,
          subtitle: `${maskAccountNumber(b.accountNumber)}${b.bank ? ` · ${b.bank}` : ''}`,
          accountId,
          note: accountId == null ? "Compte introuvable côté serveur : virement impossible vers ce bénéficiaire." : null,
        });
      });
    accounts
      .filter((a) => String(a.id) !== sourceId)
      .forEach((a) =>
        list.push({
          key: `acc-${a.id}`,
          tab: 'own',
          label: `${a.name ?? 'Mon compte'} ${maskAccountNumber(a.number)}`,
          subtitle: formatMoney(a.balance, a.currency),
          accountId: a.id,
          note: null,
        }),
      );
    return list;
  }, [beneficiaries, accounts, sourceId]);

  const destination = destinations.find((d) => d.key === destKey);

  const reset = () => {
    setStep(1);
    setDestKey('');
    setValues(null);
    setSubmitError(null);
    setReference(null);
  };

  const confirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await transfer({
        source_account_id: toId(sourceId),
        destination_account_id: toId(destination.accountId),
        amount: toApiAmount(values.amount),
        description: values.description || 'Virement',
      });
      setReference(data?.reference ?? data?.id ?? null);
      toast.success('Virement effectué.');
      setStep(5);
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && accounts.length === 0) return <LoadingSpinner label="Chargement de vos comptes…" />;
  if (error && accounts.length === 0) return <ErrorState message={error} onRetry={refetch} />;
  if (accounts.length === 0) {
    return <div className="card"><EmptyState icon={Users} title="Aucun compte" description="Un compte source est nécessaire pour effectuer un virement." /></div>;
  }

  const shown = destinations.filter((d) => d.tab === destTab);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="page-title">Virement</h1>
        <p className="mt-1 text-sm muted">Envoyez de l'argent en 5 étapes. Le serveur valide et enregistre l'opération.</p>
      </div>

      <ol className="flex items-center gap-1.5" aria-label="Progression du virement">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const state = n < step ? 'done' : n === step ? 'current' : 'todo';
          return (
            <li key={label} className="flex-1" aria-current={state === 'current' ? 'step' : undefined}>
              <div className={`h-1.5 rounded-full ${state === 'todo' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-primary'}`} />
              <p className={`mt-1.5 hidden text-xs sm:block ${state === 'current' ? 'font-bold' : 'muted'}`}>{label}</p>
              <span className="sr-only">{`Étape ${n} sur 5 : ${label}${state === 'done' ? ', terminée' : state === 'current' ? ', en cours' : ''}`}</span>
            </li>
          );
        })}
      </ol>
      <p className="text-sm font-bold sm:hidden" aria-hidden="true">Étape {step} sur 5 : {STEPS[step - 1]}</p>

      <section className="card p-4 sm:p-6">
        {step === 1 && (
          <fieldset className="space-y-3">
            <legend className="mb-3 text-lg font-bold">Choisissez le compte à débiter</legend>
            {accounts.map((a) => (
              <RadioCard key={a.id} name="source" checked={sourceId === String(a.id)} onChange={() => { setSourceId(String(a.id)); setDestKey(''); }} title={`${a.name ?? 'Compte'} ${maskAccountNumber(a.number)}`} subtitle={`Solde : ${formatMoney(a.balance, a.currency)}`} />
            ))}
            <div className="flex justify-end pt-3"><Button onClick={() => setStep(2)} disabled={!source}>Continuer</Button></div>
          </fieldset>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">À qui envoyer ?</h2>
            <div role="tablist" aria-label="Type de destinataire" className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {[['beneficiaries', 'Mes bénéficiaires'], ['own', 'Mes comptes']].map(([id, label]) => (
                <button key={id} type="button" role="tab" aria-selected={destTab === id} onClick={() => setDestTab(id)} className={`min-h-[40px] rounded-lg text-sm font-semibold ${destTab === id ? 'bg-white shadow-soft dark:bg-slate-700' : 'muted'}`}>
                  {label}
                </button>
              ))}
            </div>
            {benLoading && destTab === 'beneficiaries' ? (
              <LoadingSpinner label="Chargement des bénéficiaires…" />
            ) : shown.length === 0 ? (
              <EmptyState icon={Users} title={destTab === 'beneficiaries' ? 'Aucun bénéficiaire actif' : 'Aucun autre compte'} description={destTab === 'beneficiaries' ? 'Ajoutez un bénéficiaire pour lui envoyer de l’argent.' : 'Vous n’avez pas d’autre compte vers lequel virer.'} action={destTab === 'beneficiaries' ? <Link to="/app/beneficiaries" className="btn btn-secondary">Gérer mes bénéficiaires</Link> : null} />
            ) : (
              <fieldset className="space-y-3">
                <legend className="sr-only">Destinataire</legend>
                {shown.map((d) => (
                  <RadioCard key={d.key} name="destination" checked={destKey === d.key} disabled={d.accountId == null} onChange={() => setDestKey(d.key)} title={d.label} subtitle={d.subtitle} note={d.note} />
                ))}
              </fieldset>
            )}
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>Retour</Button>
              <Button onClick={() => setStep(3)} disabled={!destination}>Continuer</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Montant du virement</h2>
            <TransferForm currency={source.currency} defaults={values} onBack={() => setStep(2)} onNext={(v) => { setValues(v); setStep(4); }} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Vérifiez votre virement</h2>
            <TransferSummary source={source} destination={destination} values={values} error={submitError} submitting={submitting} onBack={() => setStep(3)} onConfirm={confirm} />
          </div>
        )}

        {step === 5 && <TransferSuccess source={source} destination={destination} values={values} reference={reference} onReset={reset} />}
      </section>

      {step < 5 && <Alert tone="info">Le solde n'est jamais modifié dans l'interface : après confirmation, les données sont relues depuis le serveur.</Alert>}
    </div>
  );
}
