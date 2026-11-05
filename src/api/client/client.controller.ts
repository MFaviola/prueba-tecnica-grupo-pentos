import { Controller, Get } from '@nestjs/common';
import { ListClientsUseCase } from '../../application/use-cases/client/list-clients.use-case.js';

@Controller('clients')
export class ClientController {
  constructor(private readonly listClients: ListClientsUseCase) {}

  @Get()
  findAll() {
    return this.listClients.execute();
  }
}