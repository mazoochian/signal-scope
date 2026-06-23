import { Controller, Get } from '@nestjs/common';
import { HostMetricsService } from './host-metrics.service';

@Controller('host-metrics')
export class HostMetricsController {
  constructor(private readonly svc: HostMetricsService) {}

  @Get()
  getMetrics() {
    return this.svc.getMetrics();
  }
}
