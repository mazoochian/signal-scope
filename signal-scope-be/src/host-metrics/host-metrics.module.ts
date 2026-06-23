import { Module } from '@nestjs/common';
import { HostMetricsController } from './host-metrics.controller';
import { HostMetricsService } from './host-metrics.service';

@Module({ controllers: [HostMetricsController], providers: [HostMetricsService] })
export class HostMetricsModule {}
