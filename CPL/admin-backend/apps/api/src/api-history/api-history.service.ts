import { Injectable } from '@nestjs/common'
import {
  EmailChangeHistoryFilterDto,
  HistoryLoginFilterDto,
} from './api-history.dto'
import { LoginHistoryService } from '@lib/grpc-client/login-history'
import { EmailChangeHistoryService } from '@lib/grpc-client/email-change-history'

@Injectable()
export class ApiHistoryService {
  constructor(
    private readonly loginHistoryService: LoginHistoryService,
    private readonly emailChangeHistoryService: EmailChangeHistoryService,
  ) {}
  async getListLoginHistory(historyLoginFilterDto: HistoryLoginFilterDto) {
    return await this.loginHistoryService.getListUserLoginHistory(
      historyLoginFilterDto,
    )
  }

  async getListEmailChangeHistory(filter: EmailChangeHistoryFilterDto) {
    return await this.emailChangeHistoryService.getListEmailChangeHistory(
      filter,
    )
  }
}
