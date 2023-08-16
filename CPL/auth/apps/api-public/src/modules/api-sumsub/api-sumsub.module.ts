import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ApiSumsubService } from './api-sumsub.service'
import { ApiSumsubController } from './api-sumsub.controller'
import { SumsubWebhookMiddleware } from '../../middlewares/sumsub-webhook.middleware'
import { SumsubModule } from '@lib/sumsub'
import { UserModule } from '@lib/user'
import { UserKycModule } from '@lib/user-kyc'
import { AuthSettingModule } from '@lib/auth-setting'
import { RedisQueueModule } from '@lib/redis-queue'
import { UserKycSumsubModule } from '@lib/user-kyc-sumsub'
import { RedisModule } from '@lib/redis'

@Module({
  imports: [
    SumsubModule,
    UserModule,
    UserKycModule,
    AuthSettingModule,
    RedisQueueModule,
    UserKycSumsubModule,
    RedisModule,
  ],
  controllers: [ApiSumsubController],
  providers: [ApiSumsubService],
})
export class ApiSumsubModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer.apply(SumsubWebhookMiddleware).forRoutes({
      path: 'sumsub/hook',
      method: RequestMethod.ALL,
    })
  }
}
