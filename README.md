# Finova — frontend React

Interface fintech (React 18 + Vite + Tailwind 3) branchée sur l'API Django du dossier `../backend`.

## Démarrage

```bash
npm install
cp .env.example .env     # Windows : copy .env.example .env
npm run dev
```

Application : http://localhost:5173 · API : `VITE_API_URL` (par défaut `http://127.0.0.1:8000/api`).
Lancez d'abord le backend (voir `../README.md`).

> Tailwind est volontairement fixé en **v3** (`tailwindcss@^3.4`) : la v4 n'utilise plus `tailwind.config.js` ni `postcss` de la même façon.

## Réel et démonstration

- **Réel (API Django)** : inscription, connexion JWT + refresh, comptes (liste, détails, ouverture), transactions, dépôt, retrait, virement, bénéficiaires, statistiques, profil.
- **Démonstration locale (Zustand, badge « démonstration »)** : cartes, épargne, budget, notifications.
- Après chaque opération, tout est relu depuis le serveur : le solde n'est jamais modifié localement.

## Fichiers à connaître

| Fichier | Rôle |
|---|---|
| `src/services/api.js` | Client Axios, JWT automatique, refresh transparent |
| `src/services/authService.js` | Connexion et inscription |
| `src/store/authStore.js`, `financeStore.js` | Session et données bancaires (Zustand) |
| `src/utils/normalize.js` | Adaptation des réponses de l'API vers l'interface |
| `src/pages/app/TransferPage.jsx` | Virement en 5 étapes |

## Sécurité

- Session en `sessionStorage` (effacée à la fermeture de l'onglet), aucune clé secrète côté front.
- Intercepteur Axios : ajout du Bearer, refresh automatique (une seule requête même en cas d'appels simultanés), puis déconnexion si le refresh échoue.
- En production, un cookie `httpOnly` posé par le backend serait préférable.
