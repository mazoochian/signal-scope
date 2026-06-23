import { Controller, Get } from '@nestjs/common';
import { TopologyService } from './topology.service';

@Controller('topology')
export class TopologyController {
  constructor(private readonly svc: TopologyService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }
}
