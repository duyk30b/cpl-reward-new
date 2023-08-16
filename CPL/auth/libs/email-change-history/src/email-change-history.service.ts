import { escapeLikeChars, formatPaginate } from '@lib/util'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { Brackets, Repository } from 'typeorm'
import { EmailChangeHistory } from './email-change-history.entity'
import {
  ICreateEmailChangeHistoryDto,
  IEmailChangeHistoryFilter,
} from './email-change-history.interface'

@Injectable()
export class EmailChangeHistoryService {
  constructor(
    @InjectRepository(EmailChangeHistory)
    private readonly emailChangeHistoryRepository: Repository<EmailChangeHistory>,
  ) {}

  async saveHistory(createHistoryDto: ICreateEmailChangeHistoryDto) {
    const { userId, oldEmail, newEmail, isModifiedByUser } = createHistoryDto
    const history = new EmailChangeHistory()
    history.userId = userId
    history.oldEmail = oldEmail
    history.newEmail = newEmail
    history.isModifiedByUser = isModifiedByUser
    return await this.emailChangeHistoryRepository.save(history)
  }

  async getListEmailChangeHistory(filter: IEmailChangeHistoryFilter) {
    const query = this.buildListHistoriesQuery(filter)

    const options: IPaginationOptions = {
      page: filter.page || 1,
      limit: filter.limit || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const result = await formatPaginate(paginate(query, options))
    return result
  }

  private buildListHistoriesQuery(filter: IEmailChangeHistoryFilter) {
    const SORT_FIELD_MAP = {
      old_email: 'old_email',
      new_email: 'new_email',
      created_at: 'created_at',
    }

    const SEARCH_FIELD_MAP = {
      old_email: 'old_email',
      new_email: 'new_email',
    }

    const { userId, searchField, searchText, sort, sortType } = filter

    const query = this.emailChangeHistoryRepository.createQueryBuilder()

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

    if (userId) {
      query.andWhere('user_id = :userId', { userId })
    }

    if (filter.sort && SORT_FIELD_MAP[sort]) {
      query.orderBy(SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      query.orderBy('created_at', 'DESC')
    }
    query.addOrderBy('id', 'ASC')

    return query
  }

  async findByUserId(userId: string) {
    return await this.emailChangeHistoryRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    })
  }
}
