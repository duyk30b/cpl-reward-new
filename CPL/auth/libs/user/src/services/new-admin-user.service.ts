import { TagService } from '@lib/tag'
import { KycStatus } from '@lib/user-kyc/enum/user-kyc.enum'
import { UserTagService } from '@lib/user-tag'
import { ListUserTagDto, UserTagResponseDto } from '@lib/user-tag/user-tag.dto'
import {
  INewAdminUserForManagementFilter,
  IUserFilterForHotWallet,
} from '@lib/user/interfaces/user.interface'
import { escapeLikeChars, formatPaginate } from '@lib/util'
import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import { IUserFilterMarketing } from 'apps/grpc-internal/src/user/internal-user.interface'
import { plainToClass } from 'class-transformer'
import {
  IPaginationOptions,
  paginateRaw,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { Brackets, Connection } from 'typeorm'
import { NewAdminUserForManagementDto } from '../dto/new-admin-user-for-management.dto'
import { UserForHotWalletDto } from '../dto/user-for-hot-wallet.dto'
import { UserForMarketingDto } from '../dto/user-for-marketing.dto'

@Injectable()
export class NewAdminUserService {
  readonly logger = new Logger(NewAdminUserService.name)
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly userTagService: UserTagService,
    private readonly tagService: TagService,
  ) {}

  async getListUserForMarketing(userFilterMarketing: IUserFilterMarketing) {
    let userIds = []
    let query
    let resultQuery
    if (userFilterMarketing.tagIds && userFilterMarketing.tagIds.length > 0) {
      const userTags = await this.userTagService.getUserIdsByTagIds(
        userFilterMarketing.tagIds,
        userFilterMarketing.page,
        userFilterMarketing.perPage,
      )
      userIds = userTags.items.map((item) => item.userId)
      if (userIds && userIds.length > 0) {
        query = this.buildListUserByUserIdsQuery(userIds)
        const users = await query.getRawMany()
        resultQuery = { items: users, meta: userTags.meta }
      } else {
        resultQuery = { items: [], meta: userTags.meta }
      }
    } else {
      query = this.buildListUserForMarketingQuery(userFilterMarketing)
      const options: IPaginationOptions = {
        page: userFilterMarketing.page || 1,
        limit: userFilterMarketing.perPage || 20,
        paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
      }
      resultQuery = paginateRaw(query, options)
    }

    const result = await formatPaginate(resultQuery)
    const data = result.data.map((item) =>
      plainToClass(UserForMarketingDto, item),
    )

    await this.mapTagWithUsers(data)

    result.data = data
    return result
  }

  async getListUserForManagement(userFilter: INewAdminUserForManagementFilter) {
    const query = this.buildListUserForManagementQuery(userFilter)

    const options: IPaginationOptions = {
      page: userFilter.page || 1,
      limit: userFilter.perPage || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const result = await formatPaginate(paginateRaw(query, options))
    return {
      ...result,
      data: result.data.map((item) =>
        plainToClass(NewAdminUserForManagementDto, item),
      ),
    }
  }

  private buildListUserForManagementQuery(
    userFilter: INewAdminUserForManagementFilter,
  ) {
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
      registered_channel: 'registered_channel',
      gg_id: 'gg_id',
      fb_id: 'fb_id',
      apple_id: 'apple_id',
      referral_gg_id: 'referral_gg_id',
      referral_fb_id: 'referral_fb_id',
      referral_apple_id: 'referral_apple_id',
      kyc_submitted_date: 'kyc_submitted_date',
      account_status: 'account_status',
    }

    const USER_SEARCH_FIELD_MAP = {
      email: 'email',
      // full_name: 'full_name',
      referral_email: 'referral_email',
    }

    const query = this.connection
      .createQueryBuilder()
      .select('result.*')
      .from((subQuery) => {
        return subQuery
          .select([
            'user.id as user_id',
            'user_info.fullName as full_name',
            'user.email as email',
            'user.type as type',
            'user.authenticatorVerifyStatus as authenticator_verify_status',
            'user.userInfoStatus as user_info_status',
            'user.status as account_status',
            'user.accountLv as account_lv',
            'user.lastLogin as last_login',
            'user.createdAt as created_at',
            'user.ggId as gg_id',
            'user.fbId as fb_id',
            'user.appleId as apple_id',
            'user_kyc.riskRating as risk_rating',
            'user_kyc.status as kyc_status',
            'user_kyc.type as kyc_type',
            'user_kyc_history.createdAt as kyc_submitted_date',
            'referrer.email as referral_email',
            'referrer.ggId as referral_gg_id',
            'referrer.fbId as referral_fb_id',
            'referrer.appleId as referral_apple_id',
            'channel.name as registered_channel',
            'channel.id as channel_id',
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
          .leftJoin(
            'user_kyc_history',
            'user_kyc_history',
            'user_kyc.user_kyc_history_id = user_kyc_history.id',
          )
          .leftJoin('user_info', 'user_info', 'user.id = user_info.user_id')
          .leftJoin('user', 'referrer', 'user.referred_by_id = referrer.id')
          .leftJoin(
            'blacklist_user',
            'blacklist_user',
            'blacklist_user.user_id = user.id',
          )
          .leftJoin('channel', 'channel', 'user.channel_id = channel.id')
      }, 'result')

    const {
      accountLv,
      searchField,
      searchText,
      riskRating,
      isBanned,
      kycStatus,
      kycType,
      levelStatus,
      accountStatus,
      accountStatuses,
      registeredChannel,
      type,
      types,
    } = userFilter

    if (searchText) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchField && USER_SEARCH_FIELD_MAP[searchField]) {
            qb.where(
              `${USER_SEARCH_FIELD_MAP[userFilter.searchField]} LIKE :keyword`,
            )
          } else {
            Object.keys(USER_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${USER_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (levelStatus) {
      query.andWhere('level_status = :levelStatus', { levelStatus })
    }

    if (accountLv) {
      query.andWhere('account_lv = :accountLv', { accountLv })
    }

    if (riskRating) {
      query.andWhere('risk_rating = :riskRating', { riskRating })
    }

    if (kycStatus) {
      query.andWhere('kyc_status = :kycStatus', { kycStatus })
    }

    if (accountStatus) {
      query.andWhere('account_status = :accountStatus', { accountStatus })
    }

    if (accountStatuses) {
      query.andWhere('account_status IN (:...accountStatuses)', {
        accountStatuses,
      })
    }

    if (kycType) {
      query.andWhere('kyc_type = :kycType', { kycType })
    }

    if (type) {
      query.andWhere('type = :type', { type })
    }

    if (isBanned != null) {
      query.andWhere('is_banned = :isBanned', { isBanned })
    }

    if (types) {
      query.andWhere('type IN (:...types)', { types })
    }

    if (registeredChannel) {
      query.andWhere('channel_id = :registeredChannel', { registeredChannel })
    }

    if (userFilter.sort && USER_SORT_FIELD_MAP[userFilter.sort]) {
      query.orderBy(
        USER_SORT_FIELD_MAP[userFilter.sort],
        userFilter.sortType || 'ASC',
      )
    } else {
      query.orderBy('created_at', 'DESC')
    }
    query.addOrderBy('user_id', 'ASC')

    return query
  }

  private buildListUserByUserIdsQuery(userIds: string[]) {
    const query = this.connection
      .createQueryBuilder()
      .select('result.*')
      .from((subQuery) => {
        return subQuery
          .select([
            'user.id as user_id',
            'user_info.fullName as full_name',
            'user.email as email',
            'user.accountLv as account_lv',
            'user.createdAt as created_at',
            'user_kyc.riskRating as risk_rating',
            'referrer.email as referral_email',
            'channel.name as channel_name',
          ])
          .from('user', 'user')
          .leftJoin('user_kyc', 'user_kyc', 'user.id = user_kyc.user_id')
          .leftJoin('user_info', 'user_info', 'user.id = user_info.user_id')
          .leftJoin('user', 'referrer', 'user.referred_by_id = referrer.id')
          .leftJoin('channel', 'channel', 'user.channel_id = channel.id')
      }, 'result')
    if (userIds && userIds.length > 0) {
      query.where('user_id IN (:...userIds)', { userIds })
    }
    return query
  }

  private buildListUserForMarketingQuery(
    userFilterMarketing: IUserFilterMarketing,
  ) {
    const USER_SORT_FIELD_MAP = {
      user_id: 'user_id',
      email: 'email',
      full_name: 'full_name',
      referral_email: 'referral_email',
      created_at: 'created_at',
      account_lv: 'account_lv',
      risk_rating: 'risk_rating',
      social_link: 'social_link',
      channel_name: 'channel_name',
    }

    const USER_SEARCH_FIELD_MAP = {
      user_id: 'user_id',
      email: 'email',
      full_name: 'full_name',
      referral_email: 'referral_email',
      channel_name: 'channel_name',
    }

    const query = this.connection
      .createQueryBuilder()
      .select('result.*')
      .from((subQuery) => {
        return subQuery
          .select([
            'user.id as user_id',
            'user_info.fullName as full_name',
            'user.email as email',
            'user.accountLv as account_lv',
            'user.createdAt as created_at',
            'user_kyc.riskRating as risk_rating',
            'referrer.email as referral_email',
            'channel.name as channel_name',
          ])
          .from('user', 'user')
          .leftJoin('user_kyc', 'user_kyc', 'user.id = user_kyc.user_id')
          .leftJoin('user_info', 'user_info', 'user.id = user_info.user_id')
          .leftJoin('user', 'referrer', 'user.referred_by_id = referrer.id')
          .leftJoin('channel', 'channel', 'user.channel_id = channel.id')
      }, 'result')

    const {
      accountLv,
      searchField,
      searchText,
      riskRating,
      startRegisterDate,
      endRegisterDate,
    } = userFilterMarketing

    if (searchText) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchField && USER_SEARCH_FIELD_MAP[searchField]) {
            qb.where(
              `${
                USER_SEARCH_FIELD_MAP[userFilterMarketing.searchField]
              } LIKE :keyword`,
            )
          } else {
            Object.keys(USER_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${USER_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (startRegisterDate) {
      query.andWhere('created_at >= :startRegisterDate', {
        startRegisterDate: Number(startRegisterDate),
      })
    }

    if (endRegisterDate) {
      query.andWhere('created_at <= :endRegisterDate', {
        endRegisterDate: Number(endRegisterDate),
      })
    }

    if (accountLv) {
      query.andWhere('account_lv = :accountLv', { accountLv })
    }

    if (riskRating) {
      query.andWhere('risk_rating = :riskRating', { riskRating })
    }

    if (
      userFilterMarketing.sort &&
      USER_SORT_FIELD_MAP[userFilterMarketing.sort]
    ) {
      query.orderBy(
        USER_SORT_FIELD_MAP[userFilterMarketing.sort],
        userFilterMarketing.sortType || 'ASC',
      )
    } else {
      query.orderBy('created_at', 'DESC')
      query.addOrderBy('user_id', 'ASC')
    }

    return query
  }

  async getTags(data: UserForMarketingDto[]) {
    if (data && data.length > 0) {
      const userIds = data.map((item) => item.userId)
      const listUserTagDto = plainToClass(
        ListUserTagDto,
        { page: 1, limit: 500, userIds },
        {
          ignoreDecorators: true,
        },
      )
      const userTags = await this.userTagService.list(listUserTagDto)
      if (userTags && userTags.items.length > 0) {
        return userTags.items.map((item) => {
          return plainToClass(UserTagResponseDto, item, {
            ignoreDecorators: true,
          })
        })
      }
    }
    return null
  }

  private async mapTagWithUsers(users: UserForMarketingDto[]) {
    await Promise.all(users.map((user) => this.mapTagWithUser(user)))
  }

  private async mapTagWithUser(user: UserForMarketingDto) {
    const tagIds = await this.userTagService.getTagIdsByUserId(user.userId)
    const tags = await this.tagService.getByIds({ ids: tagIds })
    user.tags = tags.map((tag) => tag.name)
  }

  private buildListUserForHotWalletQuery(
    userFilterHotWallet: IUserFilterForHotWallet,
  ) {
    const { keyword, userIds, notUserIds } = userFilterHotWallet

    const query = this.connection
      .createQueryBuilder()
      .select('result.*')
      .from((subQuery) => {
        return subQuery
          .select(['user.id as user_id', 'user.email as email'])
          .from('user', 'user')
      }, 'result')

    if (keyword) {
      query.andWhere('email LIKE :keyword', {
        keyword: `%${escapeLikeChars(keyword)}%`,
      })
    }

    if (userIds) {
      query.andWhere('user_id IN(:...userIds)', {
        userIds,
      })
    }

    if (notUserIds) {
      query.andWhere('user_id NOT IN (:...notUserIds)', {
        notUserIds,
      })
    }

    query.orderBy('user_id', 'DESC')

    return query
  }

  async getListUserForHotWallet(userFilterHotWallet: IUserFilterForHotWallet) {
    const query = this.buildListUserForHotWalletQuery(userFilterHotWallet)

    const options: IPaginationOptions = {
      page: userFilterHotWallet.page || 1,
      limit: userFilterHotWallet.perPage || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const resultQuery = paginateRaw(query, options)

    const result = await formatPaginate(resultQuery)

    return {
      ...result,
      data: result.data.map((item) => plainToClass(UserForHotWalletDto, item)),
    }
  }
}
