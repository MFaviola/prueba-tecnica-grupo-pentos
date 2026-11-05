import type { LoanApplication, LoanStatus } from "../../domain/entities/loan-application.entity.js";
import { ScheduledInstallment } from "../../domain/value-objects/scheduled-installment.js";

export abstract class LoanApplicationRepository{
    abstract createWithInstallments ( data: {clientId: number; requestedAmount: number ; termMonths: number ; status: LoanStatus}, installments: ScheduledInstallment[]): Promise<LoanApplication>;
}