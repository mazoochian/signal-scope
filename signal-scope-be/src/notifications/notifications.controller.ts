import { Controller, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.svc.markRead(id);
  }

  @Post('mark-all-read')
  markAllRead() {
    return this.svc.markAllRead();
  }
}
