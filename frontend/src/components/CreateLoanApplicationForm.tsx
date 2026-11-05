import { useState } from 'react';
import type { FormEvent } from 'react';
import { createLoanApplication } from '../services/loanApplications.service';
import type { LoanStatus } from '../types/loan-application.types';

interface Props {
  onCreated: () => void;
}

export function CreateLoanApplicationForm({ onCreated }: Props) {
  const [clientId, setClientId] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [status, setStatus] = useState<LoanStatus>('pending');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); 
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const created = await createLoanApplication({
        clientId: Number(clientId),
        requestedAmount: Number(requestedAmount),
        termMonths: Number(termMonths),
        status,
      });
      setSuccess(`Solicitud #${created.id} creada correctamente`);
      setClientId('');
      setRequestedAmount('');
      setTermMonths('');
      setStatus('pending');
      onCreated(); // avisa a la página para que recargue la tabla
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Nueva solicitud</h2>

      <label>
        ID del cliente
        <input type="number" min="1" required value={clientId}
          onChange={(e) => setClientId(e.target.value)} />
      </label>

      <label>
        Monto solicitado (L)
        <input type="number" min="0.01" step="0.01" required value={requestedAmount}
          onChange={(e) => setRequestedAmount(e.target.value)} />
      </label>

      <label>
        Plazo (meses)
        <input type="number" min="1" max="84" required value={termMonths}
          onChange={(e) => setTermMonths(e.target.value)} />
      </label>

      <label>
        Estado
        <select value={status} onChange={(e) => setStatus(e.target.value as LoanStatus)}>
          <option value="pending">Pendiente</option>
          <option value="approved">Aprobada</option>
          <option value="rejected">Rechazada</option>
        </select>
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Guardando...' : 'Crear solicitud'}
      </button>

      {error && <p className="message error">{error}</p>}
      {success && <p className="message success">{success}</p>}
    </form>
  );
}