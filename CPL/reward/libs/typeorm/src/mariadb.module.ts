import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MariadbConfig } from './mariadb.config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(MariadbConfig)],
      inject: [MariadbConfig.KEY],
      useFactory: (mariadbConfig: ConfigType<typeof MariadbConfig>) => mariadbConfig,
    }),
  ],
})
export class MariadbModule {}
