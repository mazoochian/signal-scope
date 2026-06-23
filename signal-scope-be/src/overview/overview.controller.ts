import { Controller, Get } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { SimulationService } from '../simulation/simulation.service';

@Controller('overview')
export class OverviewController {
  constructor(
    private readonly svc: OverviewService,
    private readonly sim: SimulationService,
  ) {}

  @Get()
  getAll() {
    return this.svc.getAll(this.sim.getKpis().stats, this.sim.getWan());
  }
}
