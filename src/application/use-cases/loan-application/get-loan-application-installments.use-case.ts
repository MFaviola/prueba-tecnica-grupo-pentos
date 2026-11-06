import { Injectable, NotFoundException } from '@nestjs/common';
import { LoanApplicationRepository } from '../../interfaces/loan-application.repository.js';
import { InstallmentRepository } from '../../interfaces/installment.repository.js';

@Injectable()
export class GetLoanApplicationInstallmentsUseCase {
  constructor(
    private readonly loanApplicationRepository: LoanApplicationRepository,
    private readonly installmentRepository: InstallmentRepository,
  ) {}

  async execute(loanApplicationId: number) {
    const loanApplication = await this.loanApplicationRepository.findById(loanApplicationId);
    if (!loanApplication) {
      throw new NotFoundException(`La solicitud con id ${loanApplicationId} no existe`);
    }

    const installments = await this.installmentRepository.findByLoanApplicationId(loanApplicationId);
    return { loanApplication, installments };
  }
}