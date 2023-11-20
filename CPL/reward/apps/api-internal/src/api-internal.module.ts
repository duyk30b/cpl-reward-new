import { MariadbModule } from '@libs/typeorm/mariadb.module'
import { RewardAggregateModule } from '@libs/typeorm/reward-aggregate'
import { RewardHistoryModule } from '@libs/typeorm/reward-history'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GlobalConfig } from 'config/global-config'
import { ApiInternalController } from './api-internal.controller'
import { ApiInternalService } from './api-internal.service'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [GlobalConfig], isGlobal: true }),
    MariadbModule,
    HealthModule,
    RewardAggregateModule,
    RewardHistoryModule,
  ],
  controllers: [ApiInternalController],
  providers: [ApiInternalService],
})
export class ApiInternalModule {}
