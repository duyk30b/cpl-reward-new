import { IEmailChangeHistoryFilter } from '@lib/email-change-history'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { GrpcEmailChangeHistoryService } from './grpc-email-change-history.service'

@Controller('grpc-email-change-history')
export class GrpcEmailChangeHistoryController {
  constructor(
    private readonly grpcEmailChangeHistoryService: GrpcEmailChangeHistoryService,
  ) {}

  @GrpcMethod('EmailChangeHistoryService')
  async getListEmailChangeHistory(
    emailChangeHistoryFilter: IEmailChangeHistoryFilter,
  ) {
    return await this.grpcEmailChangeHistoryService.getListEmailChangeHistory(
      emailChangeHistoryFilter,
    )
  }
}
