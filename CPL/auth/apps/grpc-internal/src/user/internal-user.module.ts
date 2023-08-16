import { BlacklistModule } from '@lib/blacklist'
import { OtpModule } from '@lib/otp'
import { RedisQueueModule } from '@lib/redis-queue'
import { UserModule } from '@lib/user'
import { Module } from '@nestjs/common'
import { InternalUserController } from './internal-user.controller'
import { InternalUserService } from './internal-user.service'

@Module({
  imports: [UserModule, BlacklistModule, RedisQueueModule, OtpModule],
  controllers: [InternalUserController],
  providers: [InternalUserService],
})
export class InternalUserModule {}
