import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Brackets, Repository } from 'typeorm'
import {
  ICountUserSameIpFilter,
  ICreateLoginHistoryDto,
  ILoginHistoryFilter,
  ILoginHistoryFilterOld,
} from './login-history.interface'
import { LoginHistory } from './login-history.entity'
import {
  IPaginationOptions,
  paginate,
  paginateRaw,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { escapeLikeChars, formatPaginate } from '@lib/util'
import { LoginHistoryListDto } from '../../../apps/grpc-internal/src/dto/login-history-list.dto'

@Injectable()
export class LoginHistoryService {
  constructor(
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepository: Repository<LoginHistory>,
  ) {}

  async create(createLoginHistoryDto: ICreateLoginHistoryDto) {
    return await this.loginHistoryRepository.save(
      plainToClass(LoginHistory, createLoginHistoryDto, {
        ignoreDecorators: true,
      }),
    )
  }

  async getListHistoryForUser(userId: string, filter: ILoginHistoryFilter) {
    const query =
      this.loginHistoryRepository.createQueryBuilder('login_history')

    const { fromTime, toTime } = filter

    query.andWhere('login_history.user_id = :userId', {
      userId,
    })
    if (fromTime) {
      query.andWhere('login_history.createdAt >= :fromTime', {
        fromTime,
      })
    }
    if (toTime) {
      query.andWhere('login_history.createdAt <= :toTime', {
        toTime,
      })
    }
    query.orderBy('login_history.createdAt', 'DESC')
    const options: IPaginationOptions = {
      page: filter.page || 1,
      limit: filter.perPage || 20,
    }
    return await paginate(query, options)
  }

  /**
   * TODO: this function was deprecated
   * @param filter
   */
  async getListHistoryForAdminOld(filter: ILoginHistoryFilterOld) {
    const SEARCH_FIELD_MAP = {
      email: 'user.email',
      ip: 'login_history.ip',
    }

    const SORT_FIELD_MAP = {
      created_at: 'login_history.createdAt',
      email: 'user.email',
      ip: 'login_history.ip',
      browser: 'login_history.browser',
      os: 'login_history.os',
    }

    const query = this.loginHistoryRepository
      .createQueryBuilder('login_history')
      .leftJoin('user', 'user', 'login_history.user_id = user.id')
      .select([
        'user.email as email',
        'login_history.createdAt as created_at',
        'login_history.ip as ip',
        'login_history.browser as browser',
        'login_history.os as os',
      ])

    const { fromTime, toTime } = filter

    if (fromTime) {
      query.andWhere('login_history.createdAt >= :fromTime', {
        fromTime,
      })
    }
    if (toTime) {
      query.andWhere('login_history.createdAt <= :toTime', {
        toTime,
      })
    }

    if (filter.searchKey) {
      query.andWhere(
        new Brackets((qb) => {
          if (
            !filter.selectedSearch ||
            !SEARCH_FIELD_MAP[filter.selectedSearch]
          ) {
            qb.orWhere('user.email LIKE :keyword').orWhere(
              'login_history.ip LIKE :keyword',
            )
          } else {
            qb.where(`${SEARCH_FIELD_MAP[filter.selectedSearch]} LIKE :keyword`)
          }
        }),
        {
          keyword: `%${escapeLikeChars(filter.searchKey)}%`,
        },
      )
    }

    if (filter.sort && SORT_FIELD_MAP[filter.sort]) {
      query.orderBy(SORT_FIELD_MAP[filter.sort], filter.sortType || 'ASC')
    } else {
      query.orderBy('login_history.createdAt', 'DESC')
    }

    const options: IPaginationOptions = {
      page: filter.page || 1,
      limit: filter.perPage || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }
    return await paginateRaw(query, options)
  }

  async getListLoginHistory(filter: ILoginHistoryFilter) {
    const SEARCH_FIELD_MAP = {
      email: 'user.email',
      ip: 'login_history.ip',
    }

    const SORT_FIELD_MAP = {
      created_at: 'login_history.createdAt',
      email: 'user.email',
      ip: 'login_history.ip',
      browser: 'login_history.browser',
      os: 'login_history.os',
    }

    const query = this.loginHistoryRepository
      .createQueryBuilder('login_history')
      .leftJoin('user', 'user', 'login_history.user_id = user.id')
      .select([
        'user.email as email',
        'login_history.createdAt as created_at',
        'login_history.ip as ip',
        'login_history.browser as browser',
        'login_history.os as os',
      ])

    const { fromTime, toTime, searchText, searchField, sort, sortType } = filter

    if (fromTime) {
      query.andWhere('login_history.createdAt >= :fromTime', {
        fromTime,
      })
    }
    if (toTime) {
      query.andWhere('login_history.createdAt <= :toTime', {
        toTime,
      })
    }

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
      query.orderBy('login_history.createdAt', 'DESC')
    }

    const options: IPaginationOptions = {
      page: filter.page || 1,
      limit: filter.perPage || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }
    const result = await formatPaginate(paginateRaw(query, options))
    return {
      ...result,
      data: result.data.map((item) => plainToClass(LoginHistoryListDto, item)),
    }
  }

  async countUserSameIP(userId: string, filter: ICountUserSameIpFilter) {
    const { fromTime, toTime } = filter
    const historyQuery = this.loginHistoryRepository
      .createQueryBuilder()
      .select(['DISTINCT ip as ip'])
      .andWhere('user_id = :userId', { userId })

    if (fromTime) {
      historyQuery.andWhere('createdAt >= :fromTime', {
        fromTime,
      })
    }
    if (toTime) {
      historyQuery.andWhere('createdAt <= :toTime', {
        toTime,
      })
    }

    const histories = await historyQuery.getRawMany()
    const ips = histories.map((history) => history.ip).filter((ip) => !!ip)

    if (!ips.length) return 0

    const countResult = await this.loginHistoryRepository
      .createQueryBuilder()
      .select(['COUNT(DISTINCT user_id) as count'])
      .andWhere('ip IN(:...ips)', { ips })
      .groupBy('ip')
      .orderBy('count', 'DESC')
      .getRawOne()

    return +countResult.count
  }
}
