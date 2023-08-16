import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BceUser } from './bce-user.entity'
import { HttpModule } from '@nestjs/axios'
import { BceUserSecuritySetting } from './bce-user-security-setting.entity'
import global_config from '../../../../../config/global_config'
import bce from '../../../../../config/bce'
import db from '../../../../../config/db'
import { User } from '@lib/user/entities/user.entity'
import { BlacklistUser } from '@lib/blacklist/entities/blacklist-user.entity'
import { BceConvertService } from './bce-convert.service'
import { ConsoleModule } from 'nestjs-console'

@Module({
  imports: [
    ConsoleModule,
    HttpModule,
    ConfigModule.forRoot({
      load: [global_config, bce],
      isGlobal: true,
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
        entities: [BceUser],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [db] })],
      name: 'auth',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        name: 'auth',
        host: configService.get('authenticate.mysql.master.host'),
        port: configService.get('authenticate.mysql.master.port'),
        username: configService.get('authenticate.mysql.master.user'),
        password: configService.get('authenticate.mysql.master.pass'),
        database: configService.get('authenticate.mysql.master.db'),
        entities: [User, BlacklistUser],
        autoLoadEntities: true,
        // logging: true,
        // synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([BceUser], 'bce'),
    TypeOrmModule.forFeature([BceUserSecuritySetting], 'bce'),
    TypeOrmModule.forFeature([User], 'auth'),
    TypeOrmModule.forFeature([BlacklistUser], 'auth'),
  ],
  providers: [BceConvertService],
})
export class BceConvertModule {}
