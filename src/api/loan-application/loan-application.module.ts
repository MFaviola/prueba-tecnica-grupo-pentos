import { Module } from '@nestjs/common';
import { LoanApplicationController } from './loan-application.controller.js';
import { CreateLoanApplicationUseCase } from '../../application/use-cases/loan-application/create-loan-application.use-case.js';
import { ClientRepository } from '../../application/interfaces/client.repository.js';
import { LoanApplicationRepository } from '../../application/interfaces/loan-application.repository.js';
import { KnexClientRepository } from '../../infrastructure/repositories/knex-client.repository.js';
import { KnexLoanApplicationRepository } from '../../infrastructure/repositories/knex-loan-application.repository.js';
import { ListLoanApplicationsUseCase } from '../../application/use-cases/loan-application/list-loan-applications.use-case.js';
import { GetLoanApplicationInstallmentsUseCase } from '../../application/use-cases/loan-application/get-loan-application-installments.use-case.js';
import { InstallmentRepository } from '../../application/interfaces/installment.repository.js';
import { KnexInstallmentRepository } from '../../infrastructure/repositories/knex-installment.repository.js';

@Module({
  controllers: [LoanApplicationController],
  providers: [
    CreateLoanApplicationUseCase,ListLoanApplicationsUseCase,
    { provide: ClientRepository, useClass: KnexClientRepository },
    { provide: LoanApplicationRepository, useClass: KnexLoanApplicationRepository },
    
    GetLoanApplicationInstallmentsUseCase,
    { provide: InstallmentRepository, useClass: KnexInstallmentRepository },
  ],
})
export class LoanApplicationModule {}