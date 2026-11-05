import { IsIn, IsInt, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';
import type { LoanStatus } from '../../../domain/entities/loan-application.entity.js';

export class CreateLoanApplicationDto{
     @IsInt({ message: 'clientId debe ser un número entero' })
  @IsPositive({ message: 'clientId debe ser mayor que 0' })
  clientId!: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'requestedAmount debe ser un número con máximo 2 decimales' })
  @IsPositive({ message: 'requestedAmount debe ser mayor que 0' })
  requestedAmount!: number;

  @IsInt({ message: 'termMonths debe ser un número entero' })
  @Min(1, { message: 'termMonths debe ser al menos 1 mes' })
  @Max(84, { message: 'termMonths no puede ser mayor a 84 meses' })
  termMonths!: number;

  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'], {
    message: 'status debe ser pending, approved o rejected',
  })
  status?: LoanStatus;
    
    
}
