import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { createLoanApplication } from '../services/loanApplications.service';
import { fetchClients } from '../services/clients.service';
import type { LoanStatus } from '../types/loan-application.types';
import type { Client } from '../types/client.types';

interface Props {
  onCreated: () => void;
}

const clientLabel = (client: Client) => `${client.fullName} · ${client.dni}`;

export function CreateLoanApplicationForm({ onCreated }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsError, setClientsError] = useState<string | null>(null);

  const [clientQuery, setClientQuery] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [status, setStatus] = useState<LoanStatus>('pending');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchClients(controller.signal)
      .then(setClients)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setClientsError('No se pudieron cargar los clientes');
      });
    return () => controller.abort();
  }, []);

  const selectedClient = clients.find((client) => clientLabel(client) === clientQuery);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedClient) {
      setError('Selecciona un cliente de la lista');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createLoanApplication({
        clientId: selectedClient.id,
        requestedAmount: Number(requestedAmount),
        termMonths: Number(termMonths),
        status,
      });
      setSuccess(`Solicitud #${created.id} creada para ${selectedClient.fullName}`);
      setClientQuery('');
      setRequestedAmount('');
      setTermMonths('');
      setStatus('pending');
      onCreated();
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
        Cliente
        <input
          list="clients-list"
          placeholder="Escribe el nombre o DNI..."
          required
          value={clientQuery}
          onChange={(e) => setClientQuery(e.target.value)}
        />
        <datalist id="clients-list">
          {clients.map((client) => (
            <option key={client.id} value={clientLabel(client)} />
          ))}
        </datalist>
      </label>
      {clientsError && <p className="message error">{clientsError}</p>}

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