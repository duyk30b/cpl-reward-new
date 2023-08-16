import { Module } from '@nestjs/common'
import { AuthLoginHistoryService } from './auth-login-history.service'
import { AuthLoginHistoryController } from './auth-login-history.controller'
import { LoginHistoryModule } from '@lib/login-history'

@Module({
  imports: [LoginHistoryModule],
  controllers: [AuthLoginHistoryController],
  providers: [AuthLoginHistoryService],
})
export class AuthLoginHistoryModule {}
