import type { LoanApplicationListItem } from './loan-application.types';

export interface Installment {
  id: number;
  loanApplicationId: number;
  dueDate: string;
  amount: number;
  paid: boolean;
}

export interface LoanApplicationInstallments {
  loanApplication: LoanApplicationListItem;
  installments: Installment[];
}