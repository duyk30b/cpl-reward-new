import { MysqlModule } from '@libs/mysql'
import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import globalConfig from 'config/global.config'
import { ApiService } from './api.service'
import { HealthModule } from './health/health.module'
import { ApiDeviceTokenModule } from './api-device-token/api-device-token.module'
import { ApiNotificationModule } from './api-notification/api-notification.module'
import { AuthMiddleware } from '@libs/util'
import { AuthOptionalMiddleware } from '@libs/util/middlewares/auth-optional.middleware'
import { BullQueueModule } from '@libs/redis'

@Module({
  imports: [
    MysqlModule,
    HealthModule,
    BullQueueModule.forRoot(),
    ConfigModule.forRoot({
      load: [globalConfig],
      isGlobal: true,
    }),
    ApiDeviceTokenModule,
    ApiNotificationModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    ApiService,
  ],
})
export class ApiModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'notification', method: RequestMethod.GET },
        { path: 'notification/categories', method: RequestMethod.GET },
        { path: 'notification/:id(\\d+-\\d+)', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })

    await consumer
      .apply(AuthOptionalMiddleware)
      .forRoutes(
        { path: 'notification', method: RequestMethod.GET },
        { path: 'notification/categories', method: RequestMethod.GET },
        { path: 'notification/:id(\\d+-\\d+)', method: RequestMethod.GET },
      )
  }
}
