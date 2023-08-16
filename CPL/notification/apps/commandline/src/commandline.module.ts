import { MysqlModule } from '@libs/mysql'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import globalConfig from 'config/global.config'
import { TestService } from './services/test.service'
import { BceMigrateModule } from './bce-migrate/bce-migrate.module'
import { BceMysqlModule } from '@libs/bce-mysql'
import { ThumbnailMigrateModule } from './thumbnail-migrate/thumbnail-migrate.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [globalConfig],
      isGlobal: true,
    }),
    MysqlModule,
    BceMysqlModule,
    BceMigrateModule,
    ThumbnailMigrateModule,
  ],
  providers: [TestService],
})
export class CommandlineModule {}
