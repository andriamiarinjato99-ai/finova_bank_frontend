import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';
import { STATUS_LABELS, labelFor, statusTone } from '../../utils/formatAmount';

const TONES = {
  success: { cls: 'badge-success', icon: CheckCircle2 },
  warning: { cls: 'badge-warning', icon: Clock },
  danger: { cls: 'badge-danger', icon: XCircle },
  neutral: { cls: 'badge-neutral', icon: Circle },
};

/** Icône + texte : l'état n'est jamais transmis uniquement par la couleur. */
export default function StatusBadge({ status }) {
  const tone = TONES[statusTone(status)];
  const Icon = tone.icon;
  return (
    <span className={`badge ${tone.cls}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {labelFor(STATUS_LABELS, status)}
    </span>
  );
}
