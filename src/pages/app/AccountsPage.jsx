import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useAuth } from '../../hooks/useAuth';
import { useDemoStore } from '../../store/demoStore';
import AccountCard from '../../components/accounts/AccountCard';
import AccountDetails from '../../components/accounts/AccountDetails';
import OpenAccountModal from '../../components/accounts/OpenAccountModal';
import VirtualCard from '../../components/accounts/VirtualCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import DemoBadge from '../../components/common/DemoBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { toast } from '../../store/toastStore';

export default function AccountsPage() {
  const { accounts, loading, error, refetch } = useAccounts();
  const { user } = useAuth();
  const cards = useDemoStore((s) => s.cards);
  const toggleCard = useDemoStore((s) => s.toggleCard);
  const [account, setAccount] = useState(null);
  const [card, setCard] = useState(null);
  const [opening, setOpening] = useState(false);
  const holder = (user?.client?.fullName || 'Aina Rakoto').toUpperCase();

  const onToggle = (id) => {
    const c = cards.find((x) => x.id === id);
    toggleCard(id);
    toast.info(`${c.status === 'ACTIVE' ? 'Carte de démonstration bloquée' : 'Carte de démonstration débloquée'} (local uniquement).`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Comptes</h1>
          <p className="mt-1 text-sm muted">Vos comptes et leurs soldes, tels qu'enregistrés par le serveur.</p>
        </div>
        <Button icon={Plus} onClick={() => setOpening(true)}>Ouvrir un compte</Button>
      </div>

      <section aria-labelledby="acc-title">
        <h2 id="acc-title" className="sr-only">Liste des comptes</h2>
        {loading && accounts.length === 0 ? (
          <LoadingSpinner label="Chargement de vos comptes…" />
        ) : error && accounts.length === 0 ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : accounts.length === 0 ? (
          <div className="card"><EmptyState icon={Wallet} title="Aucun compte" description="Aucun compte n'est associé à votre profil pour le moment." action={<Button icon={Plus} onClick={() => setOpening(true)}>Ouvrir un compte</Button>} /></div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {accounts.map((a) => <AccountCard key={a.id} account={a} onDetails={setAccount} />)}
          </div>
        )}
      </section>

      <section aria-labelledby="cards-title" className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="cards-title" className="text-lg font-bold">Cartes</h2>
          <DemoBadge label="Cartes de démonstration" />
        </div>
        <p className="text-sm muted">Ces cartes sont fictives. Bloquer ou débloquer n'a d'effet que dans votre navigateur.</p>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((c) => <VirtualCard key={c.id} card={c} holder={holder} onToggle={onToggle} onDetails={setCard} />)}
        </div>
      </section>

      <AccountDetails account={account} onClose={() => setAccount(null)} />
      <OpenAccountModal open={opening} onClose={() => setOpening(false)} />
      <Modal open={Boolean(card)} onClose={() => setCard(null)} title="Détails de la carte" footer={<Button variant="secondary" onClick={() => setCard(null)}>Fermer</Button>}>
        {card && (
          <div className="space-y-3 text-sm">
            <DemoBadge label="Carte de démonstration" />
            <dl className="divide-y divide-slate-100 dark:divide-slate-800">
              {[['Nom', card.brand], ['Numéro', `•••• ${card.last4}`], ['Titulaire', holder], ['Expiration', card.expiry], ['Statut', card.status === 'ACTIVE' ? 'Active (local)' : 'Bloquée (local)']].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5"><dt className="muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
              ))}
            </dl>
            <p className="text-xs muted">Aucune donnée de carte réelle n'est stockée ou affichée.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
