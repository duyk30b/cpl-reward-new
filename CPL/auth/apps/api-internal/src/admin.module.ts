import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadFileModule } from '@lib/upload-file'
import { UserKycAdminModule } from '@lib/user-kyc-admin'
import { UserKycCynopsisModule } from '@lib/user-kyc-cynopsis'
import { UserModule } from '@lib/user'
import db from 'config/db'
import global_config from 'config/global_config'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { HealthModule } from './health/health.module'
import { AmazonCognitoModule } from '@lib/amazon-cognito'
import { ArtemisModule } from '@lib/artemis'
import cynopsis from '../../../config/cynopsis'
import { BlacklistModule } from '@lib/blacklist'
import { LoginHistoryModule } from '@lib/login-history'
import { AdminAggregateModule } from '@lib/admin-aggregate'
import { UtilModule } from '@lib/util'
import special_countries from 'config/special-countries'
import bce from 'config/bce'
import { Country } from '@lib/country/entities/country.entity'
import { AdminListener } from './listeners/admin-listener'
import { DeviceModule } from '@lib/device'
import { UserKycModule } from '@lib/user-kyc'
import jwt from 'config/jwt'

@Module({
  imports: [
    UserKycModule,
    ScheduleModule.forRoot(),
    HealthModule,
    UserModule,
    UserKycAdminModule,
    UploadFileModule,
    UserKycCynopsisModule,
    AmazonCognitoModule,
    ArtemisModule,
    BlacklistModule,
    LoginHistoryModule,
    AdminAggregateModule,
    UtilModule,
    DeviceModule,
    ConfigModule.forRoot({
      load: [global_config, cynopsis, special_countries, jwt],
      isGlobal: true,
    }),
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
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    AdminListener,
  ],
})
export class AdminModule {}
