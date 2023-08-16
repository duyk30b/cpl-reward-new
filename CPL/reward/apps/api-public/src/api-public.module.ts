import { MariadbModule } from '@libs/typeorm/mariadb.module'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GlobalConfig } from 'config/global-config'
import { HealthModule } from './modules/health/health.module'
import { ValidateAuthMiddleware } from './middleware/validate-auth.middleware'
import { ApiCampaignController } from './modules/api-campaign/api-campaign.controller'
import { ApiCampaignModule } from './modules/api-campaign/api-campaign.module'
import { ApiMissionController } from './modules/api-mission/api-mission.controller'
import { ApiMissionModule } from './modules/api-mission/api-mission.module'
import { ApiFireModule } from './modules/api-fire/api-fire.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.ENV || 'local'}`, '.env'],
      isGlobal: true,
      load: [GlobalConfig],
    }),
    MariadbModule,
    HealthModule,
    ApiCampaignModule,
    ApiMissionModule,
    ...(['local', 'dev'].includes(process.env.ENV) ? [ApiFireModule] : []),
  ],
  controllers: [],
  providers: [],
})
export class ApiPublicModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateAuthMiddleware).forRoutes(ApiCampaignController)
    consumer.apply(ValidateAuthMiddleware).forRoutes(ApiMissionController)
  }
}
