import { KeyRound, Lock, ServerCog, ShieldCheck } from 'lucide-react';

const ITEMS = [
  { icon: KeyRound, title: 'Authentification JWT', text: "Votre session repose sur un jeton d'accès à durée limitée, renouvelé automatiquement. Si le renouvellement échoue, vous êtes déconnecté et renvoyé vers la connexion. Le jeton n'est jamais affiché." },
  { icon: Lock, title: 'Informations masquées', text: 'Les numéros de compte et de carte sont toujours masqués. Seuls les quatre derniers chiffres apparaissent.' },
  { icon: ShieldCheck, title: 'Confirmation des opérations', text: 'Dépôts, retraits et virements affichent un récapitulatif et demandent votre confirmation avant envoi.' },
  { icon: ServerCog, title: 'Le serveur décide', text: "L'interface ne contient aucune règle critique. Le backend valide le montant, vérifie le solde, exécute l'opération de façon atomique et enregistre l'audit." },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="page-title">Sécurité</h1>
      <p className="mt-3 max-w-2xl muted">Finova est un projet de démonstration : aucune donnée bancaire réelle n'y est utilisée. Voici néanmoins les principes appliqués.</p>
      <ul className="mt-10 space-y-4">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="card flex gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-dark dark:bg-primary/20 dark:text-indigo-200"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <div><h2 className="text-lg font-bold">{title}</h2><p className="mt-1 text-sm leading-relaxed muted">{text}</p></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
