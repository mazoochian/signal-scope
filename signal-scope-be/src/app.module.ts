import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { SimulationModule } from './simulation/simulation.module';
import { HostMetricsModule } from './host-metrics/host-metrics.module';
import { OverviewModule } from './overview/overview.module';
import { AlertsModule } from './alerts/alerts.module';
import { DevicesModule } from './devices/devices.module';
import { InterfacesModule } from './interfaces/interfaces.module';
import { TopologyModule } from './topology/topology.module';
import { WirelessModule } from './wireless/wireless.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { InventoryModule } from './inventory/inventory.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { ServicesModule } from './services/services.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    DbModule,
    SimulationModule,
    HostMetricsModule,
    OverviewModule,
    AlertsModule,
    DevicesModule,
    InterfacesModule,
    TopologyModule,
    WirelessModule,
    TelemetryModule,
    InventoryModule,
    DiscoveryModule,
    ServicesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
