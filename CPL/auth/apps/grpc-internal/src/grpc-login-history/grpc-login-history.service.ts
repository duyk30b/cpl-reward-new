import { Injectable } from '@nestjs/common'
import { ILoginHistoryFilter, LoginHistoryService } from '@lib/login-history'

@Injectable()
export class GrpcLoginHistoryService {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  async getListLoginHistory(loginHistoryFilter: ILoginHistoryFilter) {
    return await this.loginHistoryService.getListLoginHistory(
      loginHistoryFilter,
    )
  }
}
