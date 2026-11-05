import type { LoanApplication, LoanStatus } from "../../domain/entities/loan-application.entity.js";

export abstract class LoanApplicationRepository{
    abstract createWithInstallments ( data: {clientId: number, requestedAmount: number , termMonths: number , status: LoanStatus}): Promise<LoanApplication>;
}