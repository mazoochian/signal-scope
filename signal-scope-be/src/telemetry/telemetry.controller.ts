import { Controller, Get } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly svc: TelemetryService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }
}
