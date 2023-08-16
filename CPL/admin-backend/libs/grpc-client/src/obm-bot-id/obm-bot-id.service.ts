import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import {
  BotSettingItem,
  BotSettingListResponse,
  BotSettingParams,
} from './obm-bot-id.dto'
import { IGrpcObmBotService } from './obm-bot-id.interface'

@Injectable()
export class ObmBotIdService {
  private gObmBotService: IGrpcObmBotService

  constructor(@Inject('OBM_BOT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gObmBotService =
      this.client.getService<IGrpcObmBotService>('ListBotSetting')
  }

  async getBotSetting(
    query: BotSettingParams,
  ): Promise<BotSettingListResponse> {
    const botSetting = await lastValueFrom(
      this.gObmBotService.getSettingsAdmin(query),
    )
    return botSetting
  }

  async updateBotSetting(body: BotSettingItem): Promise<string> {
    await lastValueFrom(this.gObmBotService.updateBotId(body)).catch(
      (error) => {
        throw new BadRequestException(error)
      },
    )
    return 'update bot success'
  }
}
