import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceModule } from '@lib/device'
import { User } from './entities/user.entity'
import { UserService } from './services/user.service'
import { HttpModule } from '@nestjs/axios'
import { UserInfo } from './entities/user-info.entity'
import { UserInfoHistory } from './entities/user-info-history.entity'
import { EnterpriseInfo } from './entities/enterprise-info.entity'
import { UserInfoService } from './services/user-info.service'
import { EnterpriseInfoService } from './services/enterprise-info.service'
import { UserInfoHistoryService } from './services/user-info-history.service'
import { RedisModule } from '@lib/redis'
import { EnterpriseInfoHistory } from './entities/enterprise-info-history.entity'
import { EnterpriseInfoHistoryService } from './services/enterprise-info-history.service'
import { OldAdminUserService } from './services/old-admin-user.service'
import { NewAdminUserService } from './services/new-admin-user.service'
import { UserTagModule } from '@lib/user-tag'
import { ChannelModule } from '@lib/channel'
import { TagModule } from '@lib/tag'
import { UserSetting } from './entities/user-setting.entity'
import { AuthUserSettingService } from './services/auth-user-setting.service'
import { ErrorSyncUserModule } from 'libs/error-sync-user/src'
import { EmailChangeHistoryModule } from '@lib/email-change-history'
import { UserEmailModule } from '@lib/user-email'
import { DynamicLinkModule } from '@lib/dynamic-link'
import { RedisQueueModule } from '@lib/redis-queue'
import jwt from 'config/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserInfo,
      UserInfoHistory,
      EnterpriseInfo,
      EnterpriseInfoHistory,
      UserSetting,
    ]),
    RedisModule,
    ConfigModule,
    DeviceModule,
    HttpModule,
    UserTagModule,
    ChannelModule,
    TagModule,
    ErrorSyncUserModule,
    EmailChangeHistoryModule,
    UserEmailModule,
    DynamicLinkModule,
    RedisQueueModule,
    ConfigModule.forFeature(jwt),
  ],
  providers: [
    UserService,
    UserInfoService,
    UserInfoHistoryService,
    EnterpriseInfoService,
    EnterpriseInfoHistoryService,
    OldAdminUserService,
    NewAdminUserService,
    AuthUserSettingService,
  ],
  exports: [
    UserService,
    UserInfoService,
    EnterpriseInfoService,
    UserInfoHistoryService,
    EnterpriseInfoHistoryService,
    OldAdminUserService,
    NewAdminUserService,
    AuthUserSettingService,
  ],
})
export class UserModule {}
