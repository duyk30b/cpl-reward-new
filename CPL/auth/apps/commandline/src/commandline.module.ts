import { KafkaModule } from '@lib/kafka'
import { AmazonRekognitionModule } from '@lib/amazon-rekognition'
import { ErrorSyncUserModule } from '@lib/error-sync-user'
import { UserModule } from '@lib/user'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import db from 'config/db'
import global_config from 'config/global_config'
import { SyncUserInfoService } from './services/sync-user-info.service'
import { SyncUserService } from './services/sync-user.service'
import { TestService } from './services/test.service'
import { MapUserEmailService } from './services/map-user-email.service'
import { User } from '@lib/user/entities/user.entity'
import { UserEmail } from '@lib/user-email/entities/user-email.entity'
import { MigrateEmailHistoryModule } from './migrate-email-history/migrate-email-history.module'
import bce from 'config/bce'
import { BceEmailChangeHistory } from './migrate-email-history/bce-email-change-history.entity'
import kyc from 'config/kyc'
import { RemoveFaceIndexService } from './services/remove-face-index.service'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { MigrateFaceIndexModule } from './migrate-face-index/migrate-face-index.module'
import { FixDuplicateSocialIdModule } from './fix-duplicate-social-id/fix-duplicate-social-id.module'
import { FixKycImageModule } from './fix-kyc-image/fix-kyc-image.module'
import { SumsubModule } from '@lib/sumsub'
import { UploadFileModule } from '@lib/upload-file'
import { RedisQueueModule } from '@lib/redis-queue'
import { UserKycModule } from '@lib/user-kyc'
import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { UpdateKycProviderService } from './services/update-kyc-providers.service'
import { DeleteTesterUserService } from './services/delete-tester-user.service'
import { QueueCheckService } from './services/queue-check.service'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [global_config, kyc] }),
    UserModule,
    ErrorSyncUserModule,
    AmazonRekognitionModule,
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
        entities: [BceEmailChangeHistory],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, UserEmail, UserKyc, UserKycHistory]),
    MigrateEmailHistoryModule,
    MigrateFaceIndexModule,
    FixDuplicateSocialIdModule,
    FixKycImageModule,
    SumsubModule,
    UploadFileModule,
    RedisQueueModule,
    UserKycModule,
  ],
  providers: [
    SyncUserService,
    SyncUserInfoService,
    TestService,
    MapUserEmailService,
    RemoveFaceIndexService,
    UpdateKycProviderService,
    DeleteTesterUserService,
    QueueCheckService,
  ],
})
export class CommandlineModule {}
