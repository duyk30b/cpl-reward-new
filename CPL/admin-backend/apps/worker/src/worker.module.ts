import { MysqlModule } from '@app/mysql'
import { KafkaConsumerModule, KafkaValidationExceptionFilter } from '@lib/kafka'
import { ValidationException } from '@lib/util'
import { Module, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import global from 'config/global'
import { RewardSchedulerModule } from './reward-scheduler/reward-scheduler.module'
import { UserConsumerModule } from './user-consumer/user-consumer.module'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [global], isGlobal: true }),
    EventEmitterModule.forRoot(),
    UserConsumerModule,
    KafkaConsumerModule,
    MysqlModule,
    RewardSchedulerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        validateCustomDecorators: true,
        transform: true,
        validationError: {
          target: false,
          value: false,
        },
        transformOptions: {
          excludeExtraneousValues: true,
        },
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new ValidationException(validationErrors)
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: KafkaValidationExceptionFilter,
    },
  ],
})
export class WorkerModule {}
