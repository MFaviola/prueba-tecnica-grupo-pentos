import type { Client } from "../../domain/entities/client.entity.js";

export abstract class ClientRepository{
 abstract findById ( id: number): Promise <Client| null>;
 abstract findAll(): Promise<Client[]>;
}