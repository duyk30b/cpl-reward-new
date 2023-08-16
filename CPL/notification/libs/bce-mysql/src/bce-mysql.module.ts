import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import bceMysqlConfig from './bce-mysql.config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(bceMysqlConfig)],
      name: 'bce',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('bce_mysql.master.host'),
        port: configService.get('bce_mysql.master.port'),
        username: configService.get('bce_mysql.master.user'),
        password: configService.get('bce_mysql.master.pass'),
        database: configService.get('bce_mysql.master.db'),
        autoLoadEntities: true,
        // logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class BceMysqlModule {}
