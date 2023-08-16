import { Module } from '@nestjs/common'
import { InternalUserInfoService } from './internal-user-info.service'
import { InternalUserInfoController } from './internal-user-info.controller'
import { UserModule } from '@lib/user'
import { AdminAggregateModule } from '@lib/admin-aggregate'

@Module({
  imports: [UserModule, AdminAggregateModule],
  controllers: [InternalUserInfoController],
  providers: [InternalUserInfoService],
})
export class InternalUserInfoModule {}
