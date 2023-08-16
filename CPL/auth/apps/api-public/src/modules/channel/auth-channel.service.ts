import { Injectable } from '@nestjs/common'
import { ChannelService } from '@lib/channel'
import { GetChannelByNameDto } from './auth-channel.dto'
import { BusinessException } from '@lib/util'

@Injectable()
export class AuthChannelService {
  constructor(private readonly channelService: ChannelService) {}

  async findByName(getChannelByNameDto: GetChannelByNameDto) {
    const channel = await this.channelService.findByName(
      getChannelByNameDto.name,
    )
    if (!channel) {
      throw new BusinessException({ code: 404, message: 'CHANNEL.NOT_FOUND' })
    }
    return channel
  }
}
