import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../utils/errorHandler';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

// Le backend attend { username, password } : l'identifiant d'un compte créé en ligne est son adresse e-mail.
const schema = z.object({
  username: z.string().trim().min(1, 'Saisissez votre identifiant.'),
  password: z.string().min(1, 'Saisissez votre mot de passe.'),
});

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const sessionExpired = useAuthStore((s) => s.sessionExpired);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  if (isAuthenticated) return <Navigate to="/app" replace />;

  const redirectTo = location.state?.from?.pathname ?? '/app';

  const onSubmit = async ({ username, password }) => {
    setError(null);
    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setError(e.response?.status === 401 ? 'Identifiant ou mot de passe incorrect.' : getErrorMessage(e));
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:py-16">
      <h1 className="page-title">Connexion</h1>
      <p className="mt-2 text-sm muted">Accédez à vos comptes avec l'adresse e-mail choisie lors de l'inscription.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card mt-6 space-y-4 p-5 sm:p-6">
        {sessionExpired && <Alert tone="warning">Votre session a expiré. Reconnectez-vous pour continuer.</Alert>}
        <Input label="Identifiant (e-mail)" autoComplete="username" autoCapitalize="none" error={errors.username?.message} {...register('username')} />
        <div>
          <div className="relative">
            <Input label="Mot de passe" type={show ? 'text' : 'password'} autoComplete="current-password" error={errors.password?.message} className="[&_input]:pr-12" {...register('password')} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={show} className="absolute right-1 top-[30px] flex h-[44px] w-11 items-center justify-center rounded-lg text-slate-500">
              {show ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {error && <Alert tone="error" title="Connexion impossible">{error}</Alert>}
        <Button type="submit" loading={isSubmitting} className="w-full">Se connecter</Button>
      </form>

      <p className="mt-4 text-center text-sm muted">
        Pas encore de compte ? <Link to="/register" className="font-semibold text-primary hover:underline dark:text-indigo-300">Ouvrir un compte</Link>
      </p>
    </div>
  );
}
