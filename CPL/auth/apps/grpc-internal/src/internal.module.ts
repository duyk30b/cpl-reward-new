import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import db from 'config/db'
import { InternalHealthModule } from './health/internal-health.module'
import { InternalUserModule } from './user/internal-user.module'
import { InternalUserTagModule } from './user-tag/internal-user-tag.module'
import { InternalUserInfoModule } from './user-info/internal-user-info.module'
import { InternalUserKycModule } from './user-kyc/internal-user-kyc.module'
import { InternalTagModule } from './tag/internal-tag.module'
import { InternalChannelModule } from './channel/internal-channel.module'
import global_config from 'config/global_config'
import special_countries from 'config/special-countries'
import bce from 'config/bce'
import { Country } from '@lib/country/entities/country.entity'
import { GrpcLoginHistoryModule } from './grpc-login-history/grpc-login-history.module'
import { GrpcEmailChangeHistoryModule } from './grpc-email-change-history/grpc-email-change-history.module'
import jwt from 'config/jwt'
import { GrpcReasonModule } from './grpc-reason/grpc-reason.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [global_config, special_countries, jwt],
      isGlobal: true,
    }),
    InternalUserModule,
    InternalHealthModule,
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
        // logging: true,
        entities: [Country],
      }),
      inject: [ConfigService],
    }),
    InternalUserTagModule,
    InternalUserInfoModule,
    InternalUserKycModule,
    InternalTagModule,
    InternalChannelModule,
    GrpcLoginHistoryModule,
    GrpcEmailChangeHistoryModule,
    GrpcReasonModule,
  ],
})
export class InternalModule {}
