import { Module } from '@nestjs/common';
import { TopologyController } from './topology.controller';
import { TopologyService } from './topology.service';

@Module({ controllers: [TopologyController], providers: [TopologyService] })
export class TopologyModule {}
