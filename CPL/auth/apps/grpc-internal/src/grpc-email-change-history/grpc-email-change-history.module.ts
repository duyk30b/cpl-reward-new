import { Module } from '@nestjs/common'
import { GrpcEmailChangeHistoryService } from './grpc-email-change-history.service'
import { GrpcEmailChangeHistoryController } from './grpc-email-change-history.controller'
import { EmailChangeHistoryModule } from '@lib/email-change-history'

@Module({
  imports: [EmailChangeHistoryModule],
  controllers: [GrpcEmailChangeHistoryController],
  providers: [GrpcEmailChangeHistoryService],
})
export class GrpcEmailChangeHistoryModule {}
