import { API_URL } from '../config/env';
import { handleResponse } from './http';
import type { LoanApplicationInstallments } from '../types/installment.types';
import type {
  CreateLoanApplicationInput,
  LoanApplication,
  LoanApplicationListItem,
  LoanStatus,
  PaginatedResponse,
} from '../types/loan-application.types';

export async function fetchLoanApplications(
  params: { page: number; limit: number; status?: LoanStatus },
  signal?: AbortSignal,
): Promise<PaginatedResponse<LoanApplicationListItem>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.status) query.set('status', params.status);

  const response = await fetch(`${API_URL}/loan-applications?${query}`, { signal });
return handleResponse<PaginatedResponse<LoanApplicationListItem>>(response);}

export async function createLoanApplication(
  input: CreateLoanApplicationInput,
): Promise<LoanApplication> {
  const response = await fetch(`${API_URL}/loan-applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<LoanApplication>(response);
}

export async function fetchLoanApplicationInstallments(
  id: number,
  signal?: AbortSignal,
): Promise<LoanApplicationInstallments> {
  const response = await fetch(`${API_URL}/loan-applications/${id}/installments`, { signal });
  return handleResponse<LoanApplicationInstallments>(response);
}