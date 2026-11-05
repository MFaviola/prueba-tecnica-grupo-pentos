import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { ConfigModule } from '@nestjs/config';
import { LoanApplicationModule } from './api/loan-application/loan-application.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule,LoanApplicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}