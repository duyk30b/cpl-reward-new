import { KafkaModule, KafkaValidateException, KafkaValidateExceptionFilter } from '@lib/kafka'
import { BullQueueModule } from '@lib/redis'
import { Module, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { GlobalConfig } from 'config/global-config'
import { AuthConsumerModule } from './auth-consumer/auth-consumer.module'
import { BceConsumerModule } from './bce-consumer/bce-consumer.module'
import { ExchangeConsumerModule } from './exchange-consumer/exchange-consumer.module'
import { HealthModule } from './health/health.module'
import { HighLowConsumerModule } from './hight-low-consumer/high-low-consumer.module'
import { RewardConsumerModule } from './reward-consumer/reward-consumer.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.ENV || 'local'}`, '.env'],
      isGlobal: true,
      load: [GlobalConfig],
    }),
    KafkaModule.registerDecorator(),
    BullQueueModule.forRoot(),
    BullQueueModule.registerProducer(),
    HealthModule,
    AuthConsumerModule,
    BceConsumerModule,
    ExchangeConsumerModule,
    HighLowConsumerModule,
    RewardConsumerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        validateCustomDecorators: true,
        validationError: { target: false, value: false },
        skipMissingProperties: true, // no validate field undefined
        whitelist: true,
        transform: true, // use for DTO
        transformOptions: {
          excludeExtraneousValues: true, // exclude field not in class DTO => no
          exposeUnsetFields: false, // expose field undefined in DTO => no
        },
        exceptionFactory: (errors: ValidationError[] = []) => {
          return new KafkaValidateException(errors)
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: KafkaValidateExceptionFilter,
    },
  ],
})
export class EventDispatcherModule {}
