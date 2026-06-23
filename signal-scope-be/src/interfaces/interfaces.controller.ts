import { Controller, Get } from '@nestjs/common';
import { InterfacesService } from './interfaces.service';

@Controller('interfaces')
export class InterfacesController {
  constructor(private readonly svc: InterfacesService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }
}
