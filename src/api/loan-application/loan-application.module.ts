import { Module } from '@nestjs/common';
import { LoanApplicationController } from './loan-application.controller.js';
import { CreateLoanApplicationUseCase } from '../../application/use-cases/loan-application/create-loan-application.use-case.js';
import { ClientRepository } from '../../application/interfaces/client.repository.js';
import { LoanApplicationRepository } from '../../application/interfaces/loan-application.repository.js';
import { KnexClientRepository } from '../../infrastructure/repositories/knex-client.repository.js';
import { KnexLoanApplicationRepository } from '../../infrastructure/repositories/knex-loan-application.repository.js';
import { ListLoanApplicationsUseCase } from '../../application/use-cases/loan-application/list-loan-applications.use-case.js';

@Module({
  controllers: [LoanApplicationController],
  providers: [
    CreateLoanApplicationUseCase,ListLoanApplicationsUseCase,
    { provide: ClientRepository, useClass: KnexClientRepository },
    { provide: LoanApplicationRepository, useClass: KnexLoanApplicationRepository },
  ],
})
export class LoanApplicationModule {}