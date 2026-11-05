import type { LoanApplication, LoanStatus } from "../../domain/entities/loan-application.entity.js";
import type { ScheduledInstallment } from "../../domain/value-objects/scheduled-installment.js";

export interface LoanApplicationFilters {
  page: number;
  limit: number;
  status?: LoanStatus;
  from?: Date;
  to?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export abstract class LoanApplicationRepository{
    abstract createWithInstallments ( data: {clientId: number; requestedAmount: number ; termMonths: number ; status: LoanStatus}, installments: ScheduledInstallment[]): Promise<LoanApplication>;
    abstract findAll(filters: LoanApplicationFilters): Promise<PaginatedResult<LoanApplication>>;
}