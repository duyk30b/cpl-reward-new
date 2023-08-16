import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import {
  IAddRequest,
  IChannelService,
  IDeleteRequest,
  IFindOneRequest,
  IListRequest,
  IUpdateRequest,
} from '.'
import {
  ChannelDto,
  ChannelResponseDto,
  ListChannelResponseDto,
} from './channel.dto'
import { ParseResponseGrpc } from '..'

@Injectable()
export class ChannelService {
  private gChannelSrv: IChannelService
  constructor(@Inject('CHANNEL_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gChannelSrv =
      this.client.getService<IChannelService>('GChannelService')
  }

  async create(addChannel: IAddRequest): Promise<ChannelResponseDto> {
    const result = await lastValueFrom(this.gChannelSrv.add(addChannel))
    return ParseResponseGrpc<ChannelResponseDto>(ChannelDto, result)
  }

  async findOne(findOne: IFindOneRequest): Promise<ChannelResponseDto> {
    const result = await firstValueFrom(this.gChannelSrv.findOne(findOne))
    return ParseResponseGrpc<ChannelResponseDto>(ChannelDto, result)
  }

  async update(updateChannel: IUpdateRequest): Promise<ChannelResponseDto> {
    const result = await firstValueFrom(this.gChannelSrv.update(updateChannel))
    return ParseResponseGrpc<ChannelResponseDto>(ChannelDto, result)
  }

  async findAll(listFilter: IListRequest): Promise<ListChannelResponseDto> {
    const result = await firstValueFrom(this.gChannelSrv.list(listFilter))
    return ParseResponseGrpc<ListChannelResponseDto>(ChannelDto, result)
  }

  async delete(deleteChannel: IDeleteRequest): Promise<ChannelResponseDto> {
    const result = await lastValueFrom(this.gChannelSrv.delete(deleteChannel))
    return ParseResponseGrpc<ChannelResponseDto>(ChannelDto, result)
  }
}
