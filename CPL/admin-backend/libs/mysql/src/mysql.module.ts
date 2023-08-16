import { Module } from '@nestjs/common'
import { MysqlService } from './mysql.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import db from 'config/db'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [db] })],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql_master.host'),
        port: configService.get('mysql_master.port'),
        username: configService.get('mysql_master.user'),
        password: configService.get('mysql_master.pass'),
        database: configService.get('mysql_master.db'),
        autoLoadEntities: true,
        // synchronize: true,
        // logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MysqlService],
  exports: [MysqlService],
})
export class MysqlModule {}
