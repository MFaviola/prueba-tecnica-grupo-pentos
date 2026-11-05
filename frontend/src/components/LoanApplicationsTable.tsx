import { memo } from 'react';
import type { LoanApplication } from '../types/loan-application.types';

const currency = new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' });
const dateFormat = new Intl.DateTimeFormat('es-HN', { dateStyle: 'medium', timeStyle: 'short' });

const statusLabels = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
} as const;

interface Props {
  items: LoanApplication[];
}

export const LoanApplicationsTable = memo(function LoanApplicationsTable({ items }: Props) {
  if (items.length === 0) {
    return <p className="empty">No hay solicitudes para mostrar.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Monto</th>
          <th>Plazo</th>
          <th>Estado</th>
          <th>Creada</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.clientId}</td>
            <td>{currency.format(item.requestedAmount)}</td>
            <td>{item.termMonths} meses</td>
            <td>
              <span className={`badge badge-${item.status}`}>{statusLabels[item.status]}</span>
            </td>
            <td>{dateFormat.format(new Date(item.createdAt))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});