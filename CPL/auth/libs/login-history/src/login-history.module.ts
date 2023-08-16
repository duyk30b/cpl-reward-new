import { DeviceModule } from '@lib/device'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoginHistory } from './login-history.entity'
import { LoginHistoryService } from './login-history.service'

@Module({
  imports: [TypeOrmModule.forFeature([LoginHistory]), DeviceModule],
  providers: [LoginHistoryService],
  exports: [LoginHistoryService],
})
export class LoginHistoryModule {}
