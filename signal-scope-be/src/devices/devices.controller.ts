import { Controller, Get, Post, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { DevicesService, CreateDeviceDto } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private readonly svc: DevicesService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }

  @Post()
  create(@Body() dto: CreateDeviceDto) {
    return this.svc.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const deleted = this.svc.delete(Number(id));
    if (!deleted) throw new NotFoundException(`Device ${id} not found`);
    return { deleted: true };
  }
}
