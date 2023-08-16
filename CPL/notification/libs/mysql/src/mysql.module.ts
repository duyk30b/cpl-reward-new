import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import mysqlConfig from '@libs/mysql/mysql.config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(mysqlConfig)],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql.master.host'),
        port: configService.get('mysql.master.port'),
        username: configService.get('mysql.master.user'),
        password: configService.get('mysql.master.pass'),
        database: configService.get('mysql.master.db'),
        autoLoadEntities: true,
        // logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlModule {}
