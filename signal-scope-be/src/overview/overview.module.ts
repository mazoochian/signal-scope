import { Module } from '@nestjs/common';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';
import { SimulationModule } from '../simulation/simulation.module';

@Module({
  imports:     [SimulationModule],
  controllers: [OverviewController],
  providers:   [OverviewService],
})
export class OverviewModule {}
