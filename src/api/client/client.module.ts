import { Module } from '@nestjs/common';
import { ClientController } from './client.controller.js';
import { ListClientsUseCase } from '../../application/use-cases/client/list-clients.use-case.js';
import { ClientRepository } from '../../application/interfaces/client.repository.js';
import { KnexClientRepository } from '../../infrastructure/repositories/knex-client.repository.js';

@Module({
  controllers: [ClientController],
  providers: [ListClientsUseCase, { provide: ClientRepository, useClass: KnexClientRepository }],
})
export class ClientModule {}