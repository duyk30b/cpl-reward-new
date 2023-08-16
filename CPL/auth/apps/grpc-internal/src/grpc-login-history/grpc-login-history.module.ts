import { Module } from '@nestjs/common'
import { GrpcLoginHistoryService } from './grpc-login-history.service'
import { GrpcLoginHistoryController } from './grpc-login-history.controller'
import { LoginHistoryModule } from '@lib/login-history'
import { UserModule } from '@lib/user'

@Module({
  imports: [LoginHistoryModule, UserModule],
  controllers: [GrpcLoginHistoryController],
  providers: [GrpcLoginHistoryService],
})
export class GrpcLoginHistoryModule {}
