import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import db from '../../../config/db'
import cynopsis from 'config/cynopsis'
import global_config from '../../../config/global_config'
import { Country } from '@lib/country/entities/country.entity'
import bce from 'config/bce'
import special_countries from 'config/special-countries'
import { KafkaModule } from '@lib/kafka'
import {
  ExportUserConsumers,
  ExportUserMarketingConsumers,
} from './consumers/export-user.consumers'
import { UtilModule } from '@lib/util'
import { UserKycModule } from '@lib/user-kyc'
import kyc from 'config/kyc'
import { WorkerKycService } from './services/worker-kyc.service'
import { UserConsumer } from './consumers/user.consumer'
import { KycProviderModule } from '@lib/kyc-provider'
import { UserModule } from '@lib/user'
import { UploadFileModule } from '@lib/upload-file'
import { UserEmailModule } from '@lib/user-email'
import { AuthSettingModule } from '@lib/auth-setting'
import { UserKycAdminModule } from '@lib/user-kyc-admin'
import { RedisQueueModule } from '@lib/redis-queue'
import { WorkerUserService } from './services/worker-user.service'
import { BlacklistModule } from '@lib/blacklist'
import { KycConsumer } from './consumers/kyc.consumer'
import { SumsubModule } from '@lib/sumsub'
import { UserKycSumsubModule } from '@lib/user-kyc-sumsub'
import { UserSettingModule } from '@lib/user-setting'
import { WebsocketModule } from '@lib/websocket'
import { EmailChangeHistoryModule } from '@lib/email-change-history'
import { LoginHistoryModule } from '@lib/login-history'
import { DeviceModule } from '@lib/device'
import { WorkerSumsubService } from './services/worker-sumsub.service'
import { SumsubConsumer } from './consumers/sumsub.consumer'
import { FlowsModule } from '@lib/flows'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    UserKycModule,
    UserModule,
    UserEmailModule,
    AuthSettingModule,
    UserSettingModule,
    UtilModule,
    KycProviderModule,
    UploadFileModule,
    UserKycAdminModule,
    BlacklistModule,
    SumsubModule,
    UserKycSumsubModule,
    WebsocketModule,
    EmailChangeHistoryModule,
    LoginHistoryModule,
    DeviceModule,
    ConfigModule.forRoot({
      load: [cynopsis, global_config, special_countries, kyc],
    }),
    KafkaModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [db] })],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('authenticate.mysql.master.host'),
        port: configService.get('authenticate.mysql.master.port'),
        username: configService.get('authenticate.mysql.master.user'),
        password: configService.get('authenticate.mysql.master.pass'),
        database: configService.get('authenticate.mysql.master.db'),
        autoLoadEntities: true,
        // logging: true,
        // synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [bce] })],
      name: 'bce',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        name: 'bce',
        host: configService.get('bce_mysql.slave.host'),
        port: configService.get('bce_mysql.slave.port'),
        username: configService.get('bce_mysql.slave.user'),
        password: configService.get('bce_mysql.slave.pass'),
        database: configService.get('bce_mysql.slave.db'),
        autoLoadEntities: true,
        synchronize: false,
        entities: [Country],
      }),
      inject: [ConfigService],
    }),
    RedisQueueModule,
    FlowsModule,
    UploadFileModule,
    HealthModule,
  ],
  providers: [
    ExportUserConsumers,
    ExportUserMarketingConsumers,
    UserConsumer,
    KycConsumer,
    SumsubConsumer,
    WorkerKycService,
    WorkerUserService,
    WorkerSumsubService,
  ],
  exports: [],
})
export class CynopsisModule {}
