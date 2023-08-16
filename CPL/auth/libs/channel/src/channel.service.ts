import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Channel } from '@lib/channel/entities/channel.entity'
import { Brackets, In, Repository } from 'typeorm'
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate'
import {
  CreateChannelDto,
  DeleteChannelDto,
  FindByIdsChannelDto,
  FindOneChannelDto,
  ListChannelDto,
  UpdateChannelDto,
} from './channel.dto'
import { plainToClass } from 'class-transformer'
import { escapeLikeChars } from '@lib/util'
import { DynamicLinkService } from '@lib/dynamic-link'

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private readonly dynamicLinkService: DynamicLinkService,
  ) {}

  async findOne(findOneChannel: FindOneChannelDto): Promise<Channel> {
    const query = {}
    findOneChannel.id ? (query['id'] = findOneChannel.id) : ''
    findOneChannel.link ? (query['link'] = findOneChannel.link) : ''
    return await this.channelRepository.findOne({
      where: query,
    })
  }

  async findByName(name: string): Promise<Channel> {
    return await this.channelRepository.findOne({
      where: {
        name,
      },
    })
  }

  async listChannel(listChannel: ListChannelDto): Promise<Pagination<Channel>> {
    const CHANNEL_SORT_FIELD_MAP = {
      id: 'id',
      name: 'name',
      link: 'link',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }

    const CHANNEL_SEARCH_FIELD_MAP = {
      name: 'name',
      link: 'link',
    }

    const queryBuilder = this.channelRepository
      .createQueryBuilder('channel')
      .select([
        '*',
        'channel.created_at as createdAt',
        'channel.updated_at as updatedAt',
        'channel.tag_ids as tagIds',
        'channel.dynamic_link as dynamicLink',
      ])

    const { searchField, searchText, sort, sortType } = listChannel
    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchField && CHANNEL_SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${CHANNEL_SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(CHANNEL_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${CHANNEL_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && CHANNEL_SORT_FIELD_MAP[sort]) {
      queryBuilder.orderBy(CHANNEL_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      queryBuilder.orderBy('created_at', 'DESC')
    }

    const options = {
      page: listChannel.page || 1,
      limit: listChannel.limit || 20,
    }
    return paginateRaw<Channel>(queryBuilder, options)
  }

  async getById(findOne: FindOneChannelDto) {
    return await this.channelRepository.findOne({
      where: {
        id: findOne.id,
      },
    })
  }

  async getByIds(findByIdsChannelDto: FindByIdsChannelDto) {
    return await this.channelRepository.find({
      where: {
        id: In(findByIdsChannelDto.ids),
      },
    })
  }

  async update(updateChannelDto: UpdateChannelDto): Promise<Channel> {
    try {
      const channelExists = await this.channelRepository.findOne({
        id: updateChannelDto.id,
      })
      if (!channelExists) {
        return null
      }
      const entities = plainToClass(
        Channel,
        { ...channelExists, ...updateChannelDto },
        { ignoreDecorators: true, exposeUnsetFields: false },
      )
      return await this.save(entities)
    } catch (error) {
      return null
    }
  }

  async create(createChannelDto: CreateChannelDto) {
    const channelExists = await this.channelRepository.findOne({
      link: createChannelDto.link,
    })

    if (channelExists) {
      return null
    }
    const channel = plainToClass(Channel, createChannelDto, {
      ignoreDecorators: true,
    })

    // Generate dynamic link
    const generateLink = await this.dynamicLinkService.generateDynamicLink({
      link: channel.link,
    })
    if (generateLink.result) {
      channel.dynamicLink = generateLink.data.shortLink
    }

    return await this.channelRepository.save(channel)
  }

  async delete(channelId: DeleteChannelDto) {
    return await this.channelRepository.delete(channelId.id)
  }

  async save(channel: Channel): Promise<Channel> {
    const oldChannel = await this.getById(
      plainToClass(FindOneChannelDto, { id: channel.id }),
    )
    if (oldChannel.link != channel.link || !channel.dynamicLink) {
      const generateLink = await this.dynamicLinkService.generateDynamicLink({
        link: channel.link,
      })
      if (generateLink.result) {
        channel.dynamicLink = generateLink.data.shortLink
      }
    }

    return await this.channelRepository.save(channel)
  }
}
