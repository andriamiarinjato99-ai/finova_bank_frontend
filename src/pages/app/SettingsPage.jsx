import { useNavigate } from 'react-router-dom';
import { LogOut, Monitor, Moon, RotateCcw, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useDemoStore } from '../../store/demoStore';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../store/toastStore';
import { API_URL } from '../../services/api';
import Button from '../../components/common/Button';

const OPTIONS = [
  { id: 'light', label: 'Clair', icon: Sun },
  { id: 'dark', label: 'Sombre', icon: Moon },
  { id: 'system', label: 'Système', icon: Monitor },
];

export default function SettingsPage() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="page-title">Paramètres</h1>

      <section className="card p-5" aria-labelledby="theme-title">
        <h2 id="theme-title" className="text-lg font-bold">Apparence</h2>
        <fieldset className="mt-3">
          <legend className="sr-only">Thème de l'interface</legend>
          <div className="grid grid-cols-3 gap-2">
            {OPTIONS.map(({ id, label, icon: Icon }) => (
              <label key={id} className={`flex min-h-[72px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-3 text-sm font-semibold ${mode === id ? 'border-primary bg-primary-soft dark:bg-primary/15' : 'border-slate-200 dark:border-slate-700'}`}>
                <input type="radio" name="theme" value={id} checked={mode === id} onChange={() => setMode(id)} className="sr-only" />
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
                {mode === id && <span className="sr-only"> (sélectionné)</span>}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="mt-2 text-xs muted">Votre choix est conservé sur cet appareil.</p>
      </section>

      <section className="card p-5" aria-labelledby="demo-title">
        <h2 id="demo-title" className="text-lg font-bold">Données de démonstration</h2>
        <p className="mt-1 text-sm muted">Cartes, épargne, budget et notifications sont locales à votre navigateur. Vous pouvez les remettre à zéro.</p>
        <Button variant="secondary" icon={RotateCcw} className="mt-3" onClick={() => { resetDemo(); toast.info('Données de démonstration réinitialisées.'); }}>
          Réinitialiser
        </Button>
      </section>

      <section className="card p-5" aria-labelledby="conn-title">
        <h2 id="conn-title" className="text-lg font-bold">Connexion au serveur</h2>
        <p className="mt-1 text-sm muted">Adresse de l'API utilisée par l'application :</p>
        <p className="mt-1 break-all font-mono text-sm">{API_URL}</p>
      </section>

      <section className="card p-5" aria-labelledby="session-title">
        <h2 id="session-title" className="text-lg font-bold">Session</h2>
        <Button variant="danger" icon={LogOut} className="mt-3" onClick={() => { logout(); navigate('/login'); }}>
          Se déconnecter
        </Button>
      </section>
    </div>
  );
}
