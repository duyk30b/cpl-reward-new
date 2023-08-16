import { EmailChangeHistoryService } from '@lib/email-change-history'
import { IEmailChangeHistoryFilter } from '@lib/email-change-history/email-change-history.interface'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GrpcEmailChangeHistoryService {
  constructor(
    private readonly emailChangeHistoryService: EmailChangeHistoryService,
  ) {}

  async getListEmailChangeHistory(
    emailChangeHistoryFilter: IEmailChangeHistoryFilter,
  ) {
    return await this.emailChangeHistoryService.getListEmailChangeHistory(
      emailChangeHistoryFilter,
    )
  }
}
