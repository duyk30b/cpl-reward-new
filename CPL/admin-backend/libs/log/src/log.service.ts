import { escapeLikeChars } from '@lib/util'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { paginateRaw } from 'nestjs-typeorm-paginate'
import { Brackets, Repository } from 'typeorm'
import { FilterAdminActionLogDto } from './dtos/filter-admin-action-log.dto'
import { SearchAdminActionLogDto } from './dtos/search-admin-action-log.dto'
import { AdminActionLog } from './entities/admin-action-log.entity'
import {
  IRequestAdminActionLog,
  IResponseAdminActionLog,
} from './interfaces/admin-action-log.interface'

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(AdminActionLog)
    private readonly adminActionLogRepository: Repository<AdminActionLog>,
  ) {}

  async requestLog(request: IRequestAdminActionLog) {
    const adminActionLog = plainToInstance(AdminActionLog, request, {
      ignoreDecorators: true,
    })
    return await this.adminActionLogRepository.save(adminActionLog)
  }

  async responseLog(response: IResponseAdminActionLog) {
    const adminActionLog = plainToInstance(AdminActionLog, response, {
      ignoreDecorators: true,
    })
    return await this.adminActionLogRepository.save(adminActionLog)
  }

  async find(filter: FilterAdminActionLogDto) {
    const { adminId, searchText, page, limit } = filter
    const queryBuilder = this.adminActionLogRepository
      .createQueryBuilder('admin_action_log')
      .leftJoinAndSelect('user', 'user', 'admin_action_log.admin_id = user.id')
      .select([
        'user.email as admin_email',
        'admin_action_log.ip as ip',
        'admin_action_log.endpoint as endpoint',
        'admin_action_log.method as method',
        'admin_action_log.request as request',
        'admin_action_log.status_code as status_code',
        'admin_action_log.time_processed as time_processed',
        'admin_action_log.created_at as created_at',
      ])

    if (adminId && !isNaN(Number(adminId))) {
      queryBuilder.andWhere('admin_id = :admin_id', {
        admin_id: Number(adminId),
      })
    }
    if (searchText) {
      queryBuilder.andWhere('endpoint LIKE :endpoint', {
        endpoint: `%${escapeLikeChars(searchText)}%`,
      })
    }

    queryBuilder.orderBy('admin_action_log.created_at', 'DESC')

    const options = {
      page: page || 1,
      limit: limit || 20,
    }
    return paginateRaw<AdminActionLog>(queryBuilder, options)
  }

  async search(search: SearchAdminActionLogDto) {
    const LOG_SORT_FIELD_MAP = {
      id: 'id',
      admin_id: 'admin_id',
      method: 'method',
      ip: 'ip',
      endpoint: 'endpoint',
      request: 'request',
      response: 'response',
      status_code: 'status_code',
      time_processed: 'time_processed',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }

    const LOG_SEARCH_FIELD_MAP = {
      admin_id: 'admin_id',
      method: 'method',
      ip: 'ip',
      endpoint: 'endpoint',
      request: 'request',
      response: 'response',
      status_code: 'status_code',
      time_processed: 'time_processed',
    }

    const queryBuilder = this.adminActionLogRepository
      .createQueryBuilder('admin_action_log')
      .select([
        '*',
        'admin_action_log.created_at as createdAt',
        'admin_action_log.updated_at as updatedAt',
      ])

    const { searchField, searchText, sort, sortType } = search
    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchField && LOG_SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${LOG_SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(LOG_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${LOG_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && LOG_SORT_FIELD_MAP[sort]) {
      queryBuilder.orderBy(LOG_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      queryBuilder.orderBy('created_at', 'DESC')
    }

    const options = {
      page: search.page || 1,
      limit: search.limit || 20,
    }
    return paginateRaw<AdminActionLog>(queryBuilder, options)
  }
}
