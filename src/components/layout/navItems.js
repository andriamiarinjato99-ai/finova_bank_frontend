import { Bell, LayoutDashboard, PieChart, PiggyBank, Send, Settings, User, Users, Wallet, ArrowLeftRight } from 'lucide-react';

export const NAV_GROUPS = [
  {
    label: "Vue d'ensemble",
    items: [{ to: '/app', label: 'Tableau de bord', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Banque',
    items: [
      { to: '/app/accounts', label: 'Comptes', icon: Wallet },
      { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
      { to: '/app/transfer', label: 'Transfert', icon: Send },
      { to: '/app/beneficiaries', label: 'Bénéficiaires', icon: Users },
    ],
  },
  {
    label: 'Objectifs',
    items: [
      { to: '/app/savings', label: 'Épargne', icon: PiggyBank },
      { to: '/app/budget', label: 'Budget', icon: PieChart },
    ],
  },
  {
    label: 'Mon espace',
    items: [
      { to: '/app/notifications', label: 'Notifications', icon: Bell, badge: true },
      { to: '/app/profile', label: 'Profil', icon: User },
      { to: '/app/settings', label: 'Paramètres', icon: Settings },
    ],
  },
];
