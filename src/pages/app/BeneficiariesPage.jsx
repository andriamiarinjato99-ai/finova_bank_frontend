import { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import BeneficiaryCard from '../../components/beneficiaries/BeneficiaryCard';
import BeneficiaryForm from '../../components/beneficiaries/BeneficiaryForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { toast } from '../../store/toastStore';
import { getErrorMessage } from '../../utils/errorHandler';

export default function BeneficiariesPage() {
  const beneficiaries = useFinanceStore((s) => s.beneficiaries);
  const loading = useFinanceStore((s) => s.loading.beneficiaries);
  const error = useFinanceStore((s) => s.errors.beneficiaries);
  const fetchBeneficiaries = useFinanceStore((s) => s.fetchBeneficiaries);
  const addBeneficiary = useFinanceStore((s) => s.addBeneficiary);
  const editBeneficiary = useFinanceStore((s) => s.editBeneficiary);
  const removeBeneficiary = useFinanceStore((s) => s.removeBeneficiary);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (b) => { setEditing(b); setFormOpen(true); };

  const submit = async (values) => {
    if (editing) await editBeneficiary(editing.id, values);
    else await addBeneficiary(values);
    toast.success(editing ? 'Bénéficiaire modifié.' : 'Bénéficiaire ajouté.');
    setFormOpen(false);
  };

  const confirmDelete = async () => {
    setBusy(true);
    setDeleteError(null);
    try {
      await removeBeneficiary(deleting.id);
      toast.success('Bénéficiaire supprimé.');
      setDeleting(null);
    } catch (e) {
      setDeleteError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Mes bénéficiaires</h1>
          <p className="mt-1 text-sm muted">Les personnes à qui vous envoyez de l'argent régulièrement.</p>
        </div>
        <Button icon={Plus} onClick={openNew}>Ajouter un bénéficiaire</Button>
      </div>

      {loading && beneficiaries.length === 0 ? (
        <LoadingSpinner label="Chargement de vos bénéficiaires…" />
      ) : error && beneficiaries.length === 0 ? (
        <ErrorState message={error} onRetry={fetchBeneficiaries} />
      ) : beneficiaries.length === 0 ? (
        <div className="card"><EmptyState icon={Users} title="Aucun bénéficiaire" description="Ajoutez un premier bénéficiaire pour faciliter vos virements." action={<Button icon={Plus} onClick={openNew}>Ajouter un bénéficiaire</Button>} /></div>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {beneficiaries.map((b) => (
            <li key={b.id}><BeneficiaryCard beneficiary={b} onEdit={openEdit} onDelete={(x) => { setDeleteError(null); setDeleting(x); }} /></li>
          ))}
        </ul>
      )}

      <BeneficiaryForm open={formOpen} initial={editing} onClose={() => setFormOpen(false)} onSubmit={submit} />

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Supprimer ce bénéficiaire ?" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleting(null)} disabled={busy}>Annuler</Button><Button variant="danger" onClick={confirmDelete} loading={busy}>Supprimer</Button></>}>
        <p className="text-sm">{deleting?.name} sera retiré de votre liste. Vos virements passés ne sont pas modifiés.</p>
        {deleteError && <Alert tone="error" className="mt-3">{deleteError}</Alert>}
      </Modal>
    </div>
  );
}
