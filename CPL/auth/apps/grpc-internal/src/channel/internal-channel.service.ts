import { ChannelService } from '@lib/channel'
import {
  ChannelResponseDto,
  CreateChannelDto,
  DeleteChannelDto,
  FindOneChannelDto,
  ListChannelDto,
  UpdateChannelDto,
} from '@lib/channel/channel.dto'
import { Channel } from '@lib/channel/entities/channel.entity'
import { TagService } from '@lib/tag'
import { Tag } from '@lib/tag/entities/tag.entity'
import { FindByIdsTagDto } from '@lib/tag/tag.dto'
import { uniqueArray } from '@lib/util'
import { Injectable } from '@nestjs/common'
import { classToPlain, plainToClass } from 'class-transformer'
import { ResponseDto } from '../dto/response.dto'
import { CHANNEL_MESSAGE } from './internal-channel.enum'
import {
  IAddChannel,
  IDeleteChannel,
  IFindOneChannel,
  IListChannel,
  IUpdateChannel,
} from './internal-channel.interface'

@Injectable()
export class InternalChannelService {
  constructor(
    private readonly channelService: ChannelService,
    private readonly tagService: TagService,
  ) {}

  async create(createChannel: IAddChannel): Promise<ResponseDto> {
    const tagExists = await this.getTagWithTagIds(createChannel.tagIds)
    if (
      tagExists &&
      tagExists.length != JSON.parse(createChannel.tagIds).length
    ) {
      return new ResponseDto().error(CHANNEL_MESSAGE.NOT_EXISTS_SOME_TAGS)
    }
    const createChannelDto = plainToClass(CreateChannelDto, createChannel, {
      ignoreDecorators: true,
    })
    const result = await this.channelService.create(createChannelDto)
    if (!result) {
      return new ResponseDto().error(CHANNEL_MESSAGE.EXISTS)
    }
    result['tags'] = tagExists
    const channelResponseDto = plainToClass(ChannelResponseDto, result, {
      ignoreDecorators: true,
    })
    return new ResponseDto(channelResponseDto)
  }

  async update(updateChannel: IUpdateChannel): Promise<ResponseDto> {
    let tagExists: any
    if (updateChannel.tagIds) {
      tagExists = await this.getTagWithTagIds(updateChannel.tagIds)
      if (
        tagExists &&
        tagExists.length != JSON.parse(updateChannel.tagIds).length
      ) {
        return new ResponseDto().error(CHANNEL_MESSAGE.NOT_EXISTS_SOME_TAGS)
      }
    }

    const updateChannelDto = plainToClass(UpdateChannelDto, updateChannel, {
      ignoreDecorators: true,
    })
    const updateSuccess = await this.channelService.update(updateChannelDto)
    if (!updateSuccess) {
      return new ResponseDto().error(CHANNEL_MESSAGE.UPDATE_FAIL)
    }

    if (updateChannel.tagIds) {
      updateSuccess['tags'] = tagExists
    } else {
      if (updateSuccess.tagIds) {
        updateSuccess['tags'] = await this.getTagWithTagIds(
          updateSuccess.tagIds,
        )
      }
    }

    const channelResponseDto = plainToClass(ChannelResponseDto, updateSuccess, {
      ignoreDecorators: true,
    })
    return new ResponseDto(channelResponseDto)
  }

  async findOne(findOneChannel: IFindOneChannel): Promise<ResponseDto> {
    const findOneChannelDto = plainToClass(FindOneChannelDto, findOneChannel, {
      ignoreDecorators: true,
    })
    const channel = await this.channelService.findOne(findOneChannelDto)
    if (!channel) {
      return new ResponseDto().error(CHANNEL_MESSAGE.NOT_FOUND)
    }
    const tagIds = JSON.parse(channel.tagIds)
    const findByIdsTagDto = plainToClass(
      FindByIdsTagDto,
      { ids: tagIds },
      { ignoreDecorators: true },
    )
    channel['tags'] = await this.tagService.getByIds(findByIdsTagDto)
    const channelResponseDto = plainToClass(ChannelResponseDto, channel, {
      ignoreDecorators: true,
    })
    return new ResponseDto(channelResponseDto)
  }

  async listChannel(listChannel: IListChannel): Promise<ResponseDto> {
    const listChannelDto = plainToClass(ListChannelDto, listChannel, {
      ignoreDecorators: true,
    })
    const channels = await this.channelService.listChannel(listChannelDto)
    if (!channels) {
      return new ResponseDto().error(CHANNEL_MESSAGE.NOT_FOUND)
    }

    const tagIds = []
    channels.items.filter((item) => {
      return tagIds.push(...JSON.parse(item.tagIds))
    })
    const findByIdsTagDto = plainToClass(
      FindByIdsTagDto,
      { ids: uniqueArray(tagIds) },
      {
        ignoreDecorators: true,
      },
    )
    const tags = await this.tagService.getByIds(findByIdsTagDto)
    const result = this.mapTagsWithChannels(tags, channels.items)
    return new ResponseDto({ items: result, meta: channels.meta })
  }

  async delete(deleteChannel: IDeleteChannel): Promise<ResponseDto> {
    const deleteChannelDto = plainToClass(DeleteChannelDto, deleteChannel, {
      ignoreDecorators: true,
    })
    const deleteSuccess = await this.channelService.delete(deleteChannelDto)
    if (!deleteSuccess) {
      return new ResponseDto().error(CHANNEL_MESSAGE.DELETE_FAIL)
    }
    return new ResponseDto(deleteSuccess, CHANNEL_MESSAGE.DELETE_SUCCESS)
  }

  mapTagsWithChannels(tags: Tag[], channels: Channel[]) {
    const resultChannels = []
    for (const channel of channels) {
      const tagIds = channel.tagIds ? JSON.parse(channel.tagIds) : []
      const tempTags = []
      for (const tag of tags) {
        tag.id = +tag.id
        if (tagIds.includes(tag.id)) {
          tempTags.push(classToPlain(tag))
        }
      }
      channel['tags'] = tempTags
      const channelResponseDto = plainToClass(ChannelResponseDto, channel, {
        ignoreDecorators: true,
      })
      resultChannels.push(channelResponseDto)
    }
    return resultChannels
  }

  async getTagWithTagIds(tagIds: string) {
    try {
      const parseTagIds = JSON.parse(tagIds)
      const findByIdsTagDto = plainToClass(
        FindByIdsTagDto,
        { ids: parseTagIds },
        { ignoreDecorators: true },
      )
      return await this.tagService.getByIds(findByIdsTagDto)
    } catch (error: any) {
      return null
    }
  }
}
