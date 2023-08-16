import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectRepository } from '@nestjs/typeorm'
import { escapeLikeChars } from '@lib/util'
import { Brackets, Connection, Repository } from 'typeorm'
import { IOldAdminUserForManagementFilter } from '@lib/user/interfaces/user.interface'
import {
  IPaginationOptions,
  PaginationTypeEnum,
  paginateRaw,
} from 'nestjs-typeorm-paginate'
import { User } from '../entities/user.entity'
import { KycStatus } from '@lib/user-kyc/enum/user-kyc.enum'

const USER_SORT_FIELD_MAP = {
  email: 'email',
  full_name: 'full_name',
  referral_email: 'referral_email',
  user_info_status: 'user_info_status',
  kyc_status: 'kyc_status',
  authenticator_verify_status: 'authenticator_verify_status',
  created_at: 'created_at',
  last_login: 'last_login',
  account_lv: 'account_lv',
  risk_rating: 'risk_rating',
  level_status: 'level_status',
  is_banned: 'is_banned',
  social_link: 'social_link',
}

const USER_SEARCH_FIELD_MAP = {
  email: 'email',
  // full_name: 'full_name',
  // referral_email: 'referral_email',
}

// Có thể dùng chung vs new admin service nhưng tách ra để sửa new admin chắc chắn k ảnh hưởng old admin
@Injectable()
export class OldAdminUserService {
  readonly logger = new Logger(OldAdminUserService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getListUserForManagement(userFilter: IOldAdminUserForManagementFilter) {
    const query = this.buildListUserForManagementQuery(userFilter)

    const options: IPaginationOptions = {
      page: userFilter.page || 1,
      limit: userFilter.perPage || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    return await paginateRaw(query, options)
  }

  private buildListUserForManagementQuery(
    userFilter: IOldAdminUserForManagementFilter,
  ) {
    const query = this.connection
      .createQueryBuilder()
      .select('result.*')
      .from((subQuery) => {
        return subQuery
          .select([
            'user.id as user_id',
            'user_info.fullName as full_name',
            'user.email as email',
            'user.authenticatorVerifyStatus as authenticator_verify_status',
            'user.userInfoStatus as user_info_status',
            'user.accountLv as account_lv',
            'user.lastLogin as last_login',
            'user.createdAt as created_at',
            'user_kyc.riskRating as risk_rating',
            'user_kyc.status as kyc_status',
            'user_kyc.type as kyc_type',
            'referrer.email as referral_email',
            `user.is_banned as is_banned`,
            `(
              CASE 
                WHEN user.accountLv = 3
                THEN (
                  CASE
                    WHEN user_kyc.status = ${KycStatus.NEW} THEN 3.1
                    WHEN user_kyc.status = ${KycStatus.REJECT} THEN 3.3
                    ELSE 3.2
                  END
                )
                ELSE user.accountLv
              END
            ) as level_status`,
            `(
              CASE 
                WHEN user.fbId IS NOT NULL OR user.ggId IS NOT NULL
                THEN 1
                ELSE 0
              END
            ) as social_link`,
          ])
          .from('user', 'user')
          .leftJoin('user_kyc', 'user_kyc', 'user.id = user_kyc.user_id')
          .leftJoin('user_info', 'user_info', 'user.id = user_info.user_id')
          .leftJoin('user', 'referrer', 'user.referred_by_id = referrer.id')
          .leftJoin(
            'blacklist_user',
            'blacklist_user',
            'blacklist_user.user_id = user.id',
          )
      }, 'result')

    const { searchKey, selectedSearch, sort, sortType, levelStatus } =
      userFilter
    if (searchKey) {
      query.andWhere(
        new Brackets((qb) => {
          if (selectedSearch && USER_SEARCH_FIELD_MAP[selectedSearch]) {
            qb.where(
              `${
                USER_SEARCH_FIELD_MAP[userFilter.selectedSearch]
              } LIKE :keyword`,
            )
          } else {
            Object.keys(USER_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${USER_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchKey)}%`,
        },
      )
    }

    if (levelStatus) {
      query.andWhere('level_status = :levelStatus', { levelStatus })
    }

    if (sort && USER_SORT_FIELD_MAP[sort]) {
      query.orderBy(USER_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      query.orderBy('created_at', 'DESC')
    }
    query.addOrderBy('user_id', 'ASC')

    return query
  }
}
