import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Logo Finova">
      <rect width="64" height="64" rx="16" fill="#635BFF" />
      <path d="M20 46V18h24v7H28v4h13v7H28v10z" fill="#fff" />
    </svg>
  );
}

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 rounded-lg ${className}`} aria-label="Finova — accueil">
      <LogoMark />
      <span className="text-xl font-extrabold tracking-tight">Finova</span>
    </Link>
  );
}
