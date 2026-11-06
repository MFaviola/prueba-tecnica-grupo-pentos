import type { Installment } from '../../domain/entities/installment.entity.js';

export abstract class InstallmentRepository {
  abstract findByLoanApplicationId(loanApplicationId: number): Promise<Installment[]>;
}