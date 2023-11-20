import { MariadbModule } from '@libs/typeorm/mariadb.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MigrationModule } from './migration/migration.module'
import { SeedDataModule } from './seed-data/seed-data.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.ENV || 'local'}`, '.env'],
      isGlobal: true,
    }),
    MariadbModule,
    MigrationModule,
    SeedDataModule,
  ],
  controllers: [],
  providers: [],
})
export class CommandLineModule {}
