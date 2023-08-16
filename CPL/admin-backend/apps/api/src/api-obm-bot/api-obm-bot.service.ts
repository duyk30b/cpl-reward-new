import { Injectable } from '@nestjs/common'
import {
  BotSettingItem,
  BotSettingPagination,
  BotSettingParams,
  ObmBotIdService,
} from '@lib/grpc-client/obm-bot-id'
import { UserService } from '@lib/grpc-client/user'
import { PostResponseDto } from '@lib/grpc-client/grpc-client.dto'

@Injectable()
export class ApiObmBotService {
  constructor(
    private readonly obmBotIdService: ObmBotIdService,
    private readonly userService: UserService,
  ) {}

  async getBotSetting(query: BotSettingParams): Promise<BotSettingPagination> {
    const data = await this.obmBotIdService.getBotSetting(query)
    return {
      pagination: {
        page: data.page + 1,
        size: data.size,
        total: data.total,
      },
      data: data.contents,
    }
  }

  async updateBotSetting(body: BotSettingItem): Promise<string> {
    return this.obmBotIdService.updateBotSetting(body)
  }

  async createBotUser(request: { email: string }): Promise<PostResponseDto> {
    return this.userService.createBotUser(request)
  }
}
