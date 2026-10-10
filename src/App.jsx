import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/common/Toast';
import { useThemeStore } from './store/themeStore';
import './store/authStore'; // branche l'intercepteur Axios sur la session

export default function App() {
  const syncTheme = useThemeStore((s) => s.sync);

  useEffect(() => {
    syncTheme();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', syncTheme);
    return () => media.removeEventListener('change', syncTheme);
  }, [syncTheme]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}
