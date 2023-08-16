import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import {
  IEmailChangeHistoryFilter,
  IUserEmailChangeHistoryService,
} from './email-change-history.interface'
import { lastValueFrom } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import { EmailChangeHistoryDto } from './email-change-history.dto'

@Injectable()
export class EmailChangeHistoryService {
  private emailChangeHistoryService: IUserEmailChangeHistoryService
  constructor(@Inject('EMAIL_CHANGE_HISTORY') private client: ClientGrpc) {}

  onModuleInit() {
    this.emailChangeHistoryService =
      this.client.getService<IUserEmailChangeHistoryService>(
        'EmailChangeHistoryService',
      )
  }

  async getListEmailChangeHistory(filter: IEmailChangeHistoryFilter) {
    const req = this.emailChangeHistoryService.getListEmailChangeHistory(filter)
    const result = await lastValueFrom(req)
    result.data = (result.data || []).map((item) =>
      plainToInstance(EmailChangeHistoryDto, item, { ignoreDecorators: true }),
    )
    return result
  }
}
