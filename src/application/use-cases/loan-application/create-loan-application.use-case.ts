import { Injectable, NotFoundException } from "@nestjs/common";
import { ClientRepository } from "../../interfaces/client.repository.js";
import { LoanApplicationRepository } from "../../interfaces/loan-application.repository.js";
import { CreateLoanApplicationDto } from "../../dto/loan-application/create-loan-application.dto.js";
import { generateInstallmentSchedule } from "../../../domain/services/installment-schedule.js";

@Injectable()
export class CreateLoanApplicationUseCase{
    constructor(
        private readonly clientRepository : ClientRepository,
        private readonly  loanApplicationRepository : LoanApplicationRepository,
    ){}

    async execute(dto: CreateLoanApplicationDto){
        const client = await this.clientRepository.findById(dto.clientId);
        if (!client) {
        throw new NotFoundException(`No se encontro un cliente con el id ${dto.clientId}`);
        }
        const status = dto.status ?? 'pending';
        const installments = status === 'approved'
        ? generateInstallmentSchedule(dto.requestedAmount, dto.termMonths, new Date())
        : [];

        return this.loanApplicationRepository.createWithInstallments(
  {
    clientId: dto.clientId,
    requestedAmount: dto.requestedAmount,
    termMonths: dto.termMonths,
    status,
  },
  installments,
);
} 

}
