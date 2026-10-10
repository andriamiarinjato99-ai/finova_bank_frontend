/** Données purement visuelles (non fournies par le backend). Toujours étiquetées « démonstration » dans l'UI. */

export const DEMO_CARDS = [
  { id: 'demo-card-1', brand: 'Finova Virtual', last4: '4821', holder: 'AINA RAKOTO', expiry: '09/29', status: 'ACTIVE' },
  { id: 'demo-card-2', brand: 'Finova Voyage', last4: '1096', holder: 'AINA RAKOTO', expiry: '03/28', status: 'ACTIVE' },
];

export const DEMO_SAVINGS = [
  { id: 'goal-1', name: "Voyage à l'île Maurice", saved: 860, target: 1500 },
  { id: 'goal-2', name: 'Ordinateur portable', saved: 420, target: 1200 },
  { id: 'goal-3', name: "Fonds d'urgence", saved: 1900, target: 2000 },
];

export const DEMO_BUDGETS = [
  { id: 'b-1', category: 'Alimentation', spent: 225, limit: 300 },
  { id: 'b-2', category: 'Transports', spent: 64, limit: 120 },
  { id: 'b-3', category: 'Loisirs', spent: 138, limit: 150 },
  { id: 'b-4', category: 'Logement', spent: 410, limit: 450 },
];

export const DEMO_NOTIFICATIONS = [
  { id: 'n-1', kind: 'transfer', title: 'Virement effectué', message: 'Exemple : votre virement a bien été exécuté.', date: '2026-10-05T09:12:00', read: false, demo: true },
  { id: 'n-2', kind: 'credit', title: 'Votre compte a été crédité', message: 'Exemple : un dépôt vient d’être enregistré.', date: '2026-10-04T16:40:00', read: false, demo: true },
  { id: 'n-3', kind: 'login', title: 'Nouvelle connexion', message: 'Exemple : connexion depuis un nouvel appareil.', date: '2026-10-03T08:05:00', read: true, demo: true },
  { id: 'n-4', kind: 'savings', title: "Objectif d'épargne presque atteint", message: "Exemple : « Fonds d'urgence » est à 95 %.", date: '2026-10-02T19:30:00', read: true, demo: true },
];

export const TESTIMONIALS = [
  { name: 'Aina R.', role: 'Étudiante (témoignage fictif)', text: "Je vois mes soldes et mes virements d'un coup d'œil, sans menu à fouiller." },
  { name: 'Hery M.', role: 'Artisan (témoignage fictif)', text: 'Les confirmations avant chaque opération me rassurent : je sais ce qui part et où.' },
  { name: 'Voahangy T.', role: 'Enseignante (témoignage fictif)', text: "L'application reste lisible sur mon téléphone, même avec une connexion lente." },
];

export const FAQ_ITEMS = [
  { q: 'Finova est-elle une vraie banque ?', a: "Non. Finova est un projet de démonstration : les opérations sont enregistrées dans une base de test et n'impliquent aucun argent réel." },
  { q: 'Comment me connecter ?', a: "Avec l'adresse e-mail et le mot de passe choisis lors de votre inscription." },
  { q: "Comment envoyer de l'argent à un autre client ?", a: "Demandez-lui son numéro de compte (Comptes, Voir les détails, Copier), ajoutez-le dans Bénéficiaires, puis faites un virement." },
  { q: 'Les cartes, l’épargne et le budget sont-ils réels ?', a: "Non. Ces sections utilisent des données de démonstration stockées localement dans votre navigateur et clairement étiquetées." },
  { q: 'Mes opérations sont-elles vérifiées ?', a: "Oui, par le backend. L'application affiche un résumé et demande confirmation, mais seul le serveur valide le solde et enregistre l'opération." },
];

export const PLANS = [
  { name: 'Essentiel', price: '0 €', period: 'par mois', features: ['Comptes et soldes', 'Historique des transactions', 'Virements internes'] },
  { name: 'Confort', price: '4 €', period: 'par mois', features: ['Tout Essentiel', 'Bénéficiaires illimités', 'Statistiques détaillées'], highlight: true },
  { name: 'Premium', price: '9 €', period: 'par mois', features: ['Tout Confort', 'Cartes virtuelles multiples', 'Support prioritaire'] },
];
