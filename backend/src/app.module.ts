import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [UsersModule, AuthsModule, IntegrationsModule, DashboardModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
