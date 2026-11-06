import { memo } from 'react';
import type { LoanApplicationListItem } from '../types/loan-application.types';

const currency = new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' });
const dateFormat = new Intl.DateTimeFormat('es-HN', { dateStyle: 'medium', timeStyle: 'short' });

const statusLabels = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
} as const;

interface Props {
  items: LoanApplicationListItem[];
  onViewInstallments: (id: number) => void;
}

export const LoanApplicationsTable = memo(function LoanApplicationsTable({ items, onViewInstallments }: Props) {
  if (items.length === 0) {
    return <p className="empty">No hay solicitudes para mostrar.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Cliente</th>
          <th>Monto</th>
          <th>Plazo</th>
          <th>Estado</th>
          <th>Creada</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.clientName}</td>
            <td>{currency.format(item.requestedAmount)}</td>
            <td>{item.termMonths} meses</td>
            <td>
              <span className={`badge badge-${item.status}`}>{statusLabels[item.status]}</span>
            </td>
            <td>{dateFormat.format(new Date(item.createdAt))}</td>
            <td>
              {item.status === 'approved' && (
                <button className="link-button" onClick={() => onViewInstallments(item.id)}>
                  Ver cuotas
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});