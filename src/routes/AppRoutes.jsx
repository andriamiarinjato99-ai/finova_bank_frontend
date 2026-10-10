import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import AppLayout from '../layouts/AppLayout';

import HomePage from '../pages/public/HomePage';
import FeaturesPage from '../pages/public/FeaturesPage';
import PricingPage from '../pages/public/PricingPage';
import SecurityPage from '../pages/public/SecurityPage';
import HelpPage from '../pages/public/HelpPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import DashboardPage from '../pages/app/DashboardPage';
import AccountsPage from '../pages/app/AccountsPage';
import TransactionsPage from '../pages/app/TransactionsPage';
import TransferPage from '../pages/app/TransferPage';
import BeneficiariesPage from '../pages/app/BeneficiariesPage';
import SavingsPage from '../pages/app/SavingsPage';
import BudgetPage from '../pages/app/BudgetPage';
import NotificationsPage from '../pages/app/NotificationsPage';
import ProfilePage from '../pages/app/ProfilePage';
import SettingsPage from '../pages/app/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="beneficiaries" element={<BeneficiariesPage />} />
          <Route path="savings" element={<SavingsPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
