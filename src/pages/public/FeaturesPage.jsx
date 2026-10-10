import { Link } from 'react-router-dom';
import { ArrowLeftRight, Bell, CreditCard, LineChart, Moon, PiggyBank, PieChart, Users, Wallet } from 'lucide-react';

const FEATURES = [
  { icon: Wallet, title: 'Comptes et soldes', text: 'Consultez chaque compte, son solde, sa devise, son agence et son statut.', live: true },
  { icon: ArrowLeftRight, title: 'Transactions', text: 'Historique avec recherche, filtres par type, statut, devise, date et montant, tri et pagination.', live: true },
  { icon: ArrowLeftRight, title: 'Dépôts, retraits, virements', text: 'Résumé et confirmation avant chaque opération, puis actualisation depuis le serveur.', live: true },
  { icon: Users, title: 'Bénéficiaires', text: 'Ajoutez, modifiez et supprimez vos bénéficiaires, puis utilisez-les pour vos virements.', live: true },
  { icon: LineChart, title: 'Statistiques', text: 'Clients, comptes, soldes et totaux par type d’opération.', live: true },
  { icon: CreditCard, title: 'Cartes', text: 'Cartes de démonstration, blocage et déblocage en local.', live: false },
  { icon: PiggyBank, title: 'Épargne', text: 'Objectifs d’épargne de démonstration avec suivi de progression.', live: false },
  { icon: PieChart, title: 'Budget', text: 'Catégories, plafonds et montants disponibles, en données de démonstration.', live: false },
  { icon: Bell, title: 'Notifications', text: 'Alertes locales après vos opérations.', live: false },
  { icon: Moon, title: 'Mode sombre', text: 'Clair, sombre ou selon votre système, conservé sur votre appareil.', live: true },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="page-title max-w-2xl">Tout ce que Finova vous permet de faire</h1>
      <p className="mt-3 max-w-2xl muted">Les fonctions marquées « Connecté au serveur » lisent et écrivent dans le backend Django. Les autres sont des démonstrations locales, en attendant leur API.</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text, live }) => (
          <li key={title} className="card p-5">
            <Icon className="h-6 w-6 text-primary dark:text-indigo-300" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-bold">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed muted">{text}</p>
            <span className={`badge mt-3 ${live ? 'badge-success' : 'badge-demo'}`}>{live ? 'Connecté au serveur' : 'Démonstration locale'}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10"><Link to="/register" className="btn btn-primary">Ouvrir un compte</Link></div>
    </div>
  );
}
