import { ChannelService } from '@lib/grpc-client/channel'
import { Injectable } from '@nestjs/common'
import {
  ApiCreateChannelDto,
  ApiUpdateChannelDto,
  DeleteChannelDto,
  FindOneByIdDto,
  FindOneByLinkDto,
  ListChannelDto,
} from './api-channel.dto'

@Injectable()
export class ApiChannelService {
  constructor(private channelService: ChannelService) {}

  async create(createChannelDto: ApiCreateChannelDto) {
    return await this.channelService.create(createChannelDto)
  }

  async findAll(listChannelDto: ListChannelDto) {
    const data = await this.channelService.findAll(listChannelDto)
    return data.data
  }

  async findOneByLink(findOneByLinkDto: FindOneByLinkDto) {
    return await this.channelService.findOne(findOneByLinkDto)
  }

  async findOneById(findOneByIdDto: FindOneByIdDto) {
    return await this.channelService.findOne(findOneByIdDto)
  }

  async update(id: number, updateChannelDto: ApiUpdateChannelDto) {
    updateChannelDto.id = id
    return await this.channelService.update(updateChannelDto)
  }

  async delete(deleteDto: DeleteChannelDto) {
    return await this.channelService.delete(deleteDto)
  }
}
