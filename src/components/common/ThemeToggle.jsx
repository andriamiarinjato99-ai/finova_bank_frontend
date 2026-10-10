import { Monitor, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const CYCLE = { light: 'dark', dark: 'system', system: 'light' };
const META = {
  light: { icon: Sun, label: 'Thème clair' },
  dark: { icon: Moon, label: 'Thème sombre' },
  system: { icon: Monitor, label: 'Thème du système' },
};

export default function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const { icon: Icon, label } = META[mode];
  return (
    <button
      type="button"
      onClick={() => setMode(CYCLE[mode])}
      className="btn btn-ghost min-h-[44px] min-w-[44px] px-2"
      aria-label={`${label} — cliquer pour changer`}
      title={label}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
