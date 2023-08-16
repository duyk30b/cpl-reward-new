import { Injectable } from '@nestjs/common'
import { IUserBanHistoryFilter } from './ban-user-history.interface'
import { BanUserHistory } from './ban-user-history.entity'
import { Brackets, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { escapeLikeChars, formatPaginate } from '@lib/util'
import {
  IPaginationOptions,
  paginate,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import {
  BanHistoryListDto,
  CreateBanHistoryDto,
  UpdateBanHistoryDto,
} from './ban-user-history.dto'
import { plainToInstance } from 'class-transformer'

const SEARCH_FIELD_MAP = {
  user_id: 'ban_history.userId',
  admin_action_id: 'ban_history.adminActionId',
}
const SORT_FIELD_MAP = {
  user_id: 'ban_history.userId',
  email: 'ban_history.email',
  status: 'ban_history.status',
  admin_action_id: 'ban_history.adminActionId',
  request_time: 'ban_history.requestTime',
  ban_time: 'ban_history.banTime',
}

@Injectable()
export class BanUserHistoryService {
  constructor(
    @InjectRepository(BanUserHistory)
    private readonly banUserHistoryRepository: Repository<BanUserHistory>,
  ) {}

  async getListBanHistory(filter: IUserBanHistoryFilter) {
    const query =
      this.banUserHistoryRepository.createQueryBuilder('ban_history')

    const { searchText, searchField, sort, sortType } = filter

    if (searchText) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchField && SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && SORT_FIELD_MAP[sort]) {
      query.orderBy(SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      query.orderBy('ban_history.createdAt', 'DESC')
    }

    const options: IPaginationOptions = {
      page: filter.page || 1,
      limit: filter.perPage || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }
    const result = await formatPaginate(paginate(query, options))
    return {
      ...result,
      data: result.data.map((item) =>
        plainToInstance(BanHistoryListDto, item, {
          ignoreDecorators: true,
        }),
      ),
    }
  }

  async create(
    createBanHistoryDto: CreateBanHistoryDto,
  ): Promise<BanUserHistory> {
    const banUserHistoryEntity = plainToInstance(
      BanUserHistory,
      createBanHistoryDto,
      {
        ignoreDecorators: true,
      },
    )
    return await this.banUserHistoryRepository.save(banUserHistoryEntity)
  }

  async update(
    updateBanHistoryDto: UpdateBanHistoryDto,
  ): Promise<BanUserHistory> {
    const banUserHistoryEntity = plainToInstance(
      BanUserHistory,
      updateBanHistoryDto,
      {
        ignoreDecorators: true,
      },
    )
    return await this.banUserHistoryRepository.save(banUserHistoryEntity)
  }

  async findOne(conditions: any, options = undefined) {
    return this.banUserHistoryRepository.findOne(conditions, options)
  }

  async findAll(conditions: any) {
    return this.banUserHistoryRepository.find(conditions)
  }
}
