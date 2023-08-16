import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { ResponseDto } from '../dto/response.dto'

import {
  IAddChannel,
  IDeleteChannel,
  IFindOneChannel,
  IListChannel,
  IUpdateChannel,
} from './internal-channel.interface'
import { InternalChannelService } from './internal-channel.service'

@Controller('channel')
export class InternalChannelController {
  constructor(private readonly channelService: InternalChannelService) {}

  @GrpcMethod('GChannelService')
  async add(createChannel: IAddChannel): Promise<ResponseDto> {
    return await this.channelService.create(createChannel)
  }

  @GrpcMethod('GChannelService')
  async update(updateChannel: IUpdateChannel): Promise<ResponseDto> {
    return await this.channelService.update(updateChannel)
  }

  @GrpcMethod('GChannelService')
  async findOne(findOneChannel: IFindOneChannel): Promise<ResponseDto> {
    return await this.channelService.findOne(findOneChannel)
  }

  @GrpcMethod('GChannelService')
  async list(listChannel: IListChannel) {
    return await this.channelService.listChannel(listChannel)
  }

  @GrpcMethod('GChannelService')
  async delete(channelId: IDeleteChannel): Promise<ResponseDto> {
    return await this.channelService.delete(channelId)
  }
}
