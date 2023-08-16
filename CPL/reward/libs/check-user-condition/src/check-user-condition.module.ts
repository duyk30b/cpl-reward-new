import { UserModule } from '@app/grpc-client'
import { UserInfoModule } from '@app/grpc-client/user-info'
import { Module } from '@nestjs/common'
import { CheckUserConditionService } from './check-user-condition.service'

@Module({
  imports: [UserModule, UserInfoModule],
  providers: [CheckUserConditionService],
  exports: [CheckUserConditionService],
})
export class CheckUserConditionModule {}
