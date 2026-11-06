import { useCallback, useEffect, useState } from 'react';
import { fetchLoanApplications } from './services/loanApplications.service';
import type { LoanApplicationListItem, LoanStatus, PaginatedResponse } from './types/loan-application.types';
import { useDebounce } from './hooks/useDebounce';
import { LoanApplicationsTable } from './components/LoanApplicationsTable';
import { CreateLoanApplicationForm } from './components/CreateLoanApplicationForm';
import { InstallmentsPlan } from './components/InstallmentsPlan';
import { Modal } from './components/Modal';

const STATUS_OPTIONS: { value: LoanStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
];
const PAGE_SIZE = 5;

const normalize = (text: string) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase();

function matchStatus(text: string): LoanStatus | undefined | null {
  if (text === '') return undefined;
  const option = STATUS_OPTIONS.find((o) => normalize(o.label).startsWith(text));
  return option ? option.value : null;
}

export default function App() {
  const [statusInput, setStatusInput] = useState('');
  const debouncedStatus = useDebounce(normalize(statusInput), 400);

  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResponse<LoanApplicationListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const matchedStatus = matchStatus(debouncedStatus);
  const isValidStatus = matchedStatus !== null;
  const statusFilter = matchedStatus ?? undefined;

  useEffect(() => {
    setPage(1);
  }, [debouncedStatus]);

  useEffect(() => {
    if (!isValidStatus) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchLoanApplications({ page, limit: PAGE_SIZE, status: statusFilter }, controller.signal)
      .then(setResult)
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setError(err.message === 'Failed to fetch' ? 'No se pudo conectar con el servidor' : err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, statusFilter, isValidStatus, refreshKey]);

  const closeCreate = useCallback(() => setIsCreateOpen(false), []);
  const closeInstallments = useCallback(() => setSelectedLoanId(null), []);

  const handleCreated = useCallback(() => {
    setIsCreateOpen(false);
    setNotice('Solicitud creada correctamente');
    setPage(1);
    setRefreshKey((key) => key + 1);
  }, []);

  const totalPages = result?.meta.totalPages ?? 1;

  return (
    <main className="container">
      <header>
        <h1>Solicitudes de crédito</h1>
        <button
          onClick={() => {
            setNotice(null);
            setIsCreateOpen(true);
          }}
        >
          + Nueva solicitud
        </button>
      </header>

      {notice && <p className="message success">{notice}</p>}

      <section className="card">
        <div className="toolbar">
          <label>
            Filtrar por estado
            <input
              type="search"
              placeholder="Pendiente, Aprobada o Rechazada"
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
            />
          </label>
        </div>

        {!isValidStatus && (
          <p className="message error">Estado no válido. Usa: Pendiente, Aprobada o Rechazada.</p>
        )}

        {isValidStatus && loading && <p className="message">Cargando solicitudes...</p>}
        {isValidStatus && !loading && error && <p className="message error">{error}</p>}
        {isValidStatus && !loading && !error && result && (
          <LoanApplicationsTable items={result.data} onViewInstallments={setSelectedLoanId} />
        )}

        <div className="pagination">
          <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1 || loading}>
            ← Anterior
          </button>
          <span>
            Página {page} de {Math.max(totalPages, 1)}
            {result && ` · ${result.meta.total} solicitudes`}
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || loading}>
            Siguiente →
          </button>
        </div>
      </section>

      {isCreateOpen && (
        <Modal onClose={closeCreate}>
          <CreateLoanApplicationForm onCreated={handleCreated} />
        </Modal>
      )}

      {selectedLoanId !== null && (
        <Modal onClose={closeInstallments}>
          <InstallmentsPlan loanApplicationId={selectedLoanId} />
        </Modal>
      )}
    </main>
  );
}