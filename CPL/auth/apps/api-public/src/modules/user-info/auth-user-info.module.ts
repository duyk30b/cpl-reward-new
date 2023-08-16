import { Module } from '@nestjs/common'
import { AuthUserInfoService } from './auth-user-info.service'
import { AuthUserInfoController } from './auth-user-info.controller'
import { DeviceModule } from '@lib/device'
import { UserModule } from '@lib/user'
import { ZipCodeRequiredConstraint } from '@lib/util'
import { RedisQueueModule } from '@lib/redis-queue'
import { RedisModule } from '@lib/redis'

@Module({
  imports: [DeviceModule, UserModule, RedisQueueModule, RedisModule],
  controllers: [AuthUserInfoController],
  providers: [AuthUserInfoService, ZipCodeRequiredConstraint],
})
export class AuthUserInfoModule {}
