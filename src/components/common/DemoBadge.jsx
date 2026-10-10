import { FlaskConical } from 'lucide-react';

export default function DemoBadge({ label = 'Données de démonstration' }) {
  return (
    <span className="badge badge-demo">
      <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
