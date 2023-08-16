import { Controller } from '@nestjs/common'
import { GrpcLoginHistoryService } from './grpc-login-history.service'
import { GrpcMethod } from '@nestjs/microservices'
import { ILoginHistoryFilter } from '@lib/login-history'

@Controller('grpc-login-history')
export class GrpcLoginHistoryController {
  constructor(
    private readonly grpcLoginHistoryService: GrpcLoginHistoryService,
  ) {}

  @GrpcMethod('GrpcLoginHistoryService')
  async getListLoginHistory(loginHistoryFilter: ILoginHistoryFilter) {
    return await this.grpcLoginHistoryService.getListLoginHistory(
      loginHistoryFilter,
    )
  }
}
