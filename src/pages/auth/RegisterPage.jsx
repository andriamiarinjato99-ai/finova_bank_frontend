import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerRequest } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { getErrorMessage } from '../../utils/errorHandler';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const schema = z
  .object({
    firstName: z.string().trim().min(2, 'Saisissez votre prénom.'),
    lastName: z.string().trim().min(2, 'Saisissez votre nom.'),
    email: z.string().trim().email('Saisissez une adresse e-mail valide.'),
    phone: z.string().trim().min(8, 'Saisissez un numéro de téléphone valide.'),
    password: z
      .string()
      .min(8, 'Au moins 8 caractères.')
      .regex(/[A-Za-z]/, 'Ajoutez au moins une lettre.')
      .regex(/\d/, 'Ajoutez au moins un chiffre.'),
    confirmation: z.string().min(1, 'Confirmez votre mot de passe.'),
  })
  .refine((v) => v.password === v.confirmation, { path: ['confirmation'], message: 'Les mots de passe ne correspondent pas.' });

export default function RegisterPage() {
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  if (isAuthenticated) return <Navigate to="/app" replace />;

  const onSubmit = async (values) => {
    setError(null);
    try {
      await registerRequest(values);
    } catch (e) {
      setError(getErrorMessage(e, "L'inscription a échoué. Réessayez."));
      return;
    }
    try {
      // L'e-mail sert d'identifiant : connexion automatique juste après l'inscription.
      await login(values.email.trim().toLowerCase(), values.password);
      toast.success('Bienvenue sur Finova ! Votre premier compte est ouvert.');
      navigate('/app', { replace: true });
    } catch {
      toast.info('Compte créé. Connectez-vous avec votre e-mail.');
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col px-4 py-12 sm:py-16">
      <h1 className="page-title">Ouvrir un compte</h1>
      <p className="mt-2 text-sm muted">Votre compte client et un premier compte bancaire sont créés immédiatement. Votre e-mail sert d'identifiant de connexion.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card mt-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        <Input label="Prénom" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Nom" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
        <Input label="E-mail" type="email" autoComplete="email" className="sm:col-span-2" error={errors.email?.message} {...register('email')} />
        <Input label="Téléphone" type="tel" autoComplete="tel" className="sm:col-span-2" error={errors.phone?.message} {...register('phone')} />
        <Input label="Mot de passe" type="password" autoComplete="new-password" hint="8 caractères minimum, avec lettres et chiffres." error={errors.password?.message} {...register('password')} />
        <Input label="Confirmation" type="password" autoComplete="new-password" error={errors.confirmation?.message} {...register('confirmation')} />
        {error && (
          <Alert tone="error" title="Inscription impossible" className="sm:col-span-2">
            {error}
          </Alert>
        )}
        <Button type="submit" loading={isSubmitting} className="sm:col-span-2">Créer mon compte</Button>
      </form>

      <p className="mt-4 text-center text-sm muted">
        Déjà un compte ? <Link to="/login" className="font-semibold text-primary hover:underline dark:text-indigo-300">Se connecter</Link>
      </p>
    </div>
  );
}
