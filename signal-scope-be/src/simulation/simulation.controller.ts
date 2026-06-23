import { Controller, Get, Param, Query } from '@nestjs/common';
import { SimulationService } from './simulation.service';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly svc: SimulationService) {}

  @Get('wan')
  getWan(@Query('points') points?: string) {
    return this.svc.getWan(points ? parseInt(points, 10) : 80);
  }

  @Get('kpis')
  getKpis() {
    return this.svc.getKpis();
  }

  @Get('snapshot')
  getSnapshot() {
    return this.svc.getSnapshot();
  }

  @Get('device/:id')
  getDevice(@Param('id') id: string, @Query('points') points?: string) {
    return this.svc.getDeviceHistory(id, points ? parseInt(points, 10) : 100);
  }
}
