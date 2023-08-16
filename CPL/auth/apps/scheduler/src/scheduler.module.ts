import { BlacklistModule } from '@lib/blacklist'
import { ErrorSyncUserModule } from '@lib/error-sync-user'
import { UserModule } from '@lib/user'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import db from 'config/db'
import global_config from 'config/global_config'
import { DeleteUserService } from './services/delete-user.service'
import { ResolveErrorSyncUserService } from './services/resolve-error-sync-user.service'
import { UpdateUserService } from './services/update-user.service'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [global_config] }),
    UserModule,
    BlacklistModule,
    ErrorSyncUserModule,
    ScheduleModule.forRoot(),
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
  ],
  providers: [
    ResolveErrorSyncUserService,
    DeleteUserService,
    UpdateUserService,
  ],
})
export class SchedulerModule {}
