import { Body, Controller, Post,Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { CreateLoanApplicationDto } from '../../application/dto/loan-application/create-loan-application.dto.js';
import { CreateLoanApplicationUseCase } from '../../application/use-cases/loan-application/create-loan-application.use-case.js';
import { ListLoanApplicationsDto } from '../../application/dto/loan-application/list-loan-applications.dto.js';
import { ListLoanApplicationsUseCase } from '../../application/use-cases/loan-application/list-loan-applications.use-case.js';
import { GetLoanApplicationInstallmentsUseCase } from '../../application/use-cases/loan-application/get-loan-application-installments.use-case.js';

@Controller('loan-applications')
export class LoanApplicationController {
  constructor(private readonly createLoanApplication: CreateLoanApplicationUseCase
            ,private readonly listLoanApplications: ListLoanApplicationsUseCase,
            private readonly getInstallments: GetLoanApplicationInstallmentsUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateLoanApplicationDto) {
    return this.createLoanApplication.execute(dto);
  }

@Get()
findAll(@Query() query: ListLoanApplicationsDto) {
  return this.listLoanApplications.execute(query);
}

@Get(':id/installments')
findInstallments(@Param('id', ParseIntPipe) id: number) {
  return this.getInstallments.execute(id);
}
}