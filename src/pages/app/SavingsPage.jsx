import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDemoStore } from '../../store/demoStore';
import { toast } from '../../store/toastStore';
import { formatMoney } from '../../utils/currency';
import { parseAmount } from '../../utils/formatAmount';
import ProgressBar from '../../components/common/ProgressBar';
import DemoBadge from '../../components/common/DemoBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';

export default function SavingsPage() {
  const savings = useDemoStore((s) => s.savings);
  const addSavingsGoal = useDemoStore((s) => s.addSavingsGoal);
  const contributeToGoal = useDemoStore((s) => s.contributeToGoal);

  const [goalModal, setGoalModal] = useState(false);
  const [contrib, setContrib] = useState(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const openGoal = () => { setName(''); setAmount(''); setError(null); setGoalModal(true); };
  const openContrib = (g) => { setAmount(''); setError(null); setContrib(g); };

  const saveGoal = (e) => {
    e.preventDefault();
    const target = parseAmount(amount);
    if (name.trim().length < 2) return setError('Donnez un nom à votre objectif.');
    if (!(target > 0)) return setError('Le montant doit être supérieur à 0.');
    addSavingsGoal(name.trim(), target);
    setGoalModal(false);
    toast.info('Objectif de démonstration créé (local uniquement).');
  };

  const saveContrib = (e) => {
    e.preventDefault();
    const value = parseAmount(amount);
    if (!(value > 0)) return setError('Le montant doit être supérieur à 0.');
    contributeToGoal(contrib.id, value);
    setContrib(null);
    toast.info('Simulation enregistrée localement : aucun argent réel n’a été déplacé.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Épargne</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DemoBadge />
            <span className="text-sm muted">Le backend n'a pas encore de modèle d'épargne.</span>
          </div>
        </div>
        <Button icon={Plus} onClick={openGoal}>Nouvel objectif</Button>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {savings.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <li key={g.id} className="card p-5">
              <h2 className="text-base font-bold">{g.name}</h2>
              <p className="mt-3 text-2xl font-extrabold tracking-tight">
                {formatMoney(g.saved, 'EUR')} <span className="text-base font-semibold muted">/ {formatMoney(g.target, 'EUR')}</span>
              </p>
              <div className="mt-3"><ProgressBar value={g.saved} max={g.target} label={`Progression de l'objectif ${g.name}`} /></div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{pct} %</span>
                <span className="muted">{formatMoney(g.target - g.saved, 'EUR')} restants</span>
              </div>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => openContrib(g)} disabled={g.saved >= g.target}>
                {g.saved >= g.target ? 'Objectif atteint' : 'Ajouter (simulation)'}
              </Button>
            </li>
          );
        })}
      </ul>

      <Modal open={goalModal} onClose={() => setGoalModal(false)} title="Nouvel objectif d'épargne">
        <form onSubmit={saveGoal} noValidate className="space-y-4">
          <Input label="Nom de l'objectif" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Montant à atteindre (€)" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {error && <Alert tone="error">{error}</Alert>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setGoalModal(false)}>Annuler</Button>
            <Button type="submit">Créer l'objectif</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(contrib)} onClose={() => setContrib(null)} title={`Ajouter à « ${contrib?.name ?? ''} »`}>
        <form onSubmit={saveContrib} noValidate className="space-y-4">
          <Alert tone="info">Simulation locale : aucune transaction réelle n'est effectuée.</Alert>
          <Input label="Montant à ajouter (€)" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {error && <Alert tone="error">{error}</Alert>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setContrib(null)}>Annuler</Button>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
