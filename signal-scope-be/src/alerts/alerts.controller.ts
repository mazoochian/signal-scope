import { Controller, Get } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly svc: AlertsService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }
}
