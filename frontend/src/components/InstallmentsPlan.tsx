import { useEffect, useState } from 'react';
import { fetchLoanApplicationInstallments } from '../services/loanApplications.service';
import type { LoanApplicationInstallments } from '../types/installment.types';

const currency = new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' });
const dateFormat = new Intl.DateTimeFormat('es-HN', { dateStyle: 'medium', timeZone: 'UTC' });

interface Props {
  loanApplicationId: number;
}

export function InstallmentsPlan({ loanApplicationId }: Props) {
  const [data, setData] = useState<LoanApplicationInstallments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchLoanApplicationInstallments(loanApplicationId, controller.signal)
      .then(setData)
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setError(err.message === 'Failed to fetch' ? 'No se pudo conectar con el servidor' : err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [loanApplicationId]);

  const today = new Date().toISOString().slice(0, 10);
  const totalCents = data?.installments.reduce((sum, i) => sum + Math.round(i.amount * 100), 0) ?? 0;

  return (
    <div className="card">
      <h2 className="modal-title">Plan de pagos - Solicitud #{loanApplicationId}</h2>

      {loading && <p className="message">Cargando cuotas...</p>}
      {!loading && error && <p className="message error">{error}</p>}

      {!loading && !error && data && (
        <>
          <p className="subtitle">{data.loanApplication.clientName}</p>

          {data.installments.length === 0 ? (
            <p className="empty">Esta solicitud no tiene cuotas.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vencimiento</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.installments.map((installment, index) => {
                  const isOverdue = !installment.paid && installment.dueDate.slice(0, 10) < today;
                  const label = installment.paid ? 'Pagada' : isOverdue ? 'Vencida' : 'Pendiente';
                  const badge = installment.paid ? 'approved' : isOverdue ? 'rejected' : 'pending';

                  return (
                    <tr key={installment.id}>
                      <td>{index + 1}</td>
                      <td>{dateFormat.format(new Date(installment.dueDate))}</td>
                      <td>{currency.format(installment.amount)}</td>
                      <td>
                        <span className={`badge badge-${badge}`}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <p className="total">Total: {currency.format(totalCents / 100)}</p>
        </>
      )}
    </div>
  );
}