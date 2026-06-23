import { Controller, Get } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly svc: DiscoveryService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }
}
