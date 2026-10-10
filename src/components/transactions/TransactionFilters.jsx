import { useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { CURRENCIES } from '../../utils/currency';
import { TRANSACTION_TYPE_LABELS } from '../../utils/formatAmount';

export const EMPTY_FILTERS = { search: '', type: '', status: '', currency: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '' };

export default function TransactionFilters({ values, onApply }) {
  const [draft, setDraft] = useState({ ...EMPTY_FILTERS, ...values });
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onApply(draft);
  };
  const reset = () => {
    setDraft(EMPTY_FILTERS);
    onApply(EMPTY_FILTERS);
  };

  return (
    <form onSubmit={submit} aria-label="Filtres des transactions" className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="Recherche" type="search" value={draft.search} onChange={set('search')} placeholder="Référence, description…" className="sm:col-span-2" />
        <Select label="Type" value={draft.type} onChange={set('type')}>
          <option value="">Tous les types</option>
          {Object.entries(TRANSACTION_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
        <Select label="Statut" value={draft.status} onChange={set('status')}>
          <option value="">Tous les statuts</option>
          <option value="COMPLETED">Terminée</option>
          <option value="PENDING">En attente</option>
          <option value="FAILED">Échouée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>
        <Select label="Devise" value={draft.currency} onChange={set('currency')}>
          <option value="">Toutes les devises</option>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Input label="Du" type="date" value={draft.dateFrom} onChange={set('dateFrom')} />
        <Input label="Au" type="date" value={draft.dateTo} onChange={set('dateTo')} />
        <Input label="Montant minimum" type="number" min="0" step="0.01" inputMode="decimal" value={draft.minAmount} onChange={set('minAmount')} />
        <Input label="Montant maximum" type="number" min="0" step="0.01" inputMode="decimal" value={draft.maxAmount} onChange={set('maxAmount')} />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" icon={Search}>Filtrer</Button>
        <Button variant="secondary" icon={RotateCcw} onClick={reset}>Réinitialiser</Button>
      </div>
    </form>
  );
}
