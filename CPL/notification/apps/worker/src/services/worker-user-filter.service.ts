import { Injectable, Logger } from '@nestjs/common'
import {
  ArgsForMethodAfterUserFilter,
  BullQueueService,
  EMethodAfterFilterUser,
  IPublishGroupNotificationAfterFilterUserArgs,
  ISendMailAfterFilterUserArgs,
  ISendPushAfterFilterUserArgs,
} from '@libs/redis'
import { IUserFilter, UserService } from '@libs/grpc-client'
import { UserStatus, UserType } from '@libs/grpc-client/user/user.enum'
import { UserSettingService } from '@libs/user-setting'
import { UserCondition } from '@libs/user-group/user-group.variable'
import { DEFAULT_LANG } from '@libs/common'

const CHUNK_SIZE = 1000

@Injectable()
export class WorkerUserFilterService {
  private readonly logger = new Logger(WorkerUserFilterService.name)
  constructor(
    private readonly userService: UserService,
    private readonly bullQueueService: BullQueueService,
    private readonly userSettingService: UserSettingService,
  ) {}

  async processAllUsers(
    userGroupIds: string[],
    methodAfterFilter: EMethodAfterFilterUser,
    args: ArgsForMethodAfterUserFilter,
  ) {
    const conditionGroups = []
    const initFilter = this.generateInitialFilter(conditionGroups)
    const count = await this.countUserByFilter(initFilter)

    const totalPage = Math.ceil(count / CHUNK_SIZE)

    const promises = []
    for (let i = 1; i <= totalPage; i++) {
      promises.push(
        this.addProcessJobByChunk(
          initFilter,
          i,
          conditionGroups,
          methodAfterFilter,
          args,
        ),
      )
    }

    await Promise.all(promises)
  }

  async processChunkUsers(
    userIds: string[],
    methodAfterFilter: EMethodAfterFilterUser,
    args: any,
  ) {
    await this[methodAfterFilter](userIds, args)
  }

  async [EMethodAfterFilterUser.PUBLISH_GROUP_NOTIFICATION](
    userIds: string[],
    args: IPublishGroupNotificationAfterFilterUserArgs,
  ) {
    //
  }

  async [EMethodAfterFilterUser.SEND_PUSH](
    userIds: string[],
    args: ISendPushAfterFilterUserArgs,
  ) {
    const { pushScheduleId, notificationId, deeplink, title, content } = args
    for (const userId of userIds) {
      // https://cryptopielabo.slack.com/archives/C032GAY4ZRP/p1669259554182189
      const lang = DEFAULT_LANG

      await this.bullQueueService.addUserPushCommand({
        userId,
        pushScheduleId,
        notificationId,
        data: {
          deeplink,
        },
        notification: {
          title: title[lang],
          body: content[lang],
        },
      })
      this.logger.debug(
        `Trigger send push of schedule ${pushScheduleId} - notification ${notificationId} to user: ${userId}`,
      )
    }
  }

  async [EMethodAfterFilterUser.SEND_MAIL](
    userIds: string[],
    args: ISendMailAfterFilterUserArgs,
  ) {
    //
  }

  private generateInitialFilter(
    conditionGroups: UserCondition[][],
  ): IUserFilter {
    return {
      limit: CHUNK_SIZE,
      type: UserType.NORMAL,
      statuses: [UserStatus.ACTIVE],
    }
  }

  private async countUserByFilter(filter: IUserFilter) {
    const res = await this.userService.searchByFilter({ ...filter, limit: 1 })
    return res.pagination.total
  }

  private async addProcessJobByChunk(
    filter: IUserFilter,
    page: number,
    conditionGroups: UserCondition[][],
    methodAfterFilter: EMethodAfterFilterUser,
    args: ArgsForMethodAfterUserFilter,
  ) {
    const usersResponse = await this.userService.searchByFilter({
      ...filter,
      page,
    })
    const userIds = usersResponse.data.map((user) => user.id)
    await this.bullQueueService.addFilterChunkUserByGroupJob({
      methodAfterFilter,
      args,
      userIds,
      conditionGroups,
    })
  }
}
