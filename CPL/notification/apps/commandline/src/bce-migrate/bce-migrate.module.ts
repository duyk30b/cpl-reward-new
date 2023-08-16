import { BceSettingNotification } from '@libs/bce-mysql/entities/bce-setting-notification.entity'
import { BceUserNotification } from '@libs/bce-mysql/entities/bce-user-notification.entity'
import {
  GroupNotification,
  UserReadGlobalNotification,
} from '@libs/notification'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BceMigrateService } from './bce-migrate.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupNotification, UserReadGlobalNotification]),
    TypeOrmModule.forFeature(
      [BceSettingNotification, BceUserNotification],
      'bce',
    ),
  ],
  providers: [BceMigrateService],
  exports: [BceMigrateService],
})
export class BceMigrateModule {}
