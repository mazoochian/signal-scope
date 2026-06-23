import { Controller, Get } from '@nestjs/common';
import { WirelessService } from './wireless.service';

@Controller('wireless')
export class WirelessController {
  constructor(private readonly svc: WirelessService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }
}
