import { Module } from '@nestjs/common';
import { WirelessController } from './wireless.controller';
import { WirelessService } from './wireless.service';

@Module({ controllers: [WirelessController], providers: [WirelessService] })
export class WirelessModule {}
