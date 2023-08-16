import { DEFAULT_LANG } from '@libs/common'
import { KafkaConsumerModule } from '@libs/kafka'
import { MysqlModule } from '@libs/mysql'
import { BullQueueModule } from '@libs/redis'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import globalConfig from 'config/global.config'
import { I18nModule, I18nJsonParser } from 'nestjs-i18n'
import { join } from 'path'
import { HealthModule } from './health/health.module'
import { UserConsumerModule } from './user-consumer/user-consumer.module'
import { BceConsumerModule } from './bce-consumer/bce-consumer.module'
import { HighLowConsumerModule } from './high-low-consumer/high-low-consumer.module'
import { Mt5ConsumerModule } from './mt5-consumer/mt5-consumer.module'
import { ExchangeConsumerModule } from './exchange-consumer/exchange-consumer.module'
import { ApiManagementConsumerModule } from './api-management-consumer/api-management-consumer.module'

@Module({
  imports: [
    KafkaConsumerModule,
    MysqlModule,
    UserConsumerModule,
    ConfigModule.forRoot({
      load: [globalConfig],
      isGlobal: true,
    }),
    BullQueueModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANG,
      parser: I18nJsonParser,
      parserOptions: {
        path: join(__dirname, '/i18n/'),
      },
    }),
    HealthModule,
    BceConsumerModule,
    HighLowConsumerModule,
    Mt5ConsumerModule,
    ExchangeConsumerModule,
    ApiManagementConsumerModule,
  ],
  controllers: [],
  providers: [],
})
export class EventDispatcherModule {}
