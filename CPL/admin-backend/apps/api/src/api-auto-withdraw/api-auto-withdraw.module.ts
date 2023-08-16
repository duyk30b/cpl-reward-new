import { AuthorizationModule } from '@lib/authorization'
import { WithdrawModule } from '@lib/grpc-client/withdraw'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { WithdrawController } from './api-auto-withdraw.controller'
import { ApiWithdrawService } from './api-auto-withdraw.service'

@Module({
  imports: [WithdrawModule, AbilityModule, AuthorizationModule, HttpModule],
  controllers: [WithdrawController],
  providers: [ApiWithdrawService],
})
export class ApiWithdrawModule {}
