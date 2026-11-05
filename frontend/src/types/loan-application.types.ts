export type LoanStatus = 'pending' | 'approved' | 'rejected';

export interface LoanApplication {
  id: number;
  clientId: number;
  requestedAmount: number;
  termMonths: number;
  status: LoanStatus;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface CreateLoanApplicationInput {
  clientId: number;
  requestedAmount: number;
  termMonths: number;
  status?: LoanStatus;
}