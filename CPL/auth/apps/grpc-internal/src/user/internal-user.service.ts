import { BlacklistUserService } from '@lib/blacklist'
import { IPostResponse } from '@lib/grpc-client/grpc-client.interface'
import { AuthenticatorOtpService } from '@lib/otp'
import { RedisQueueService } from '@lib/redis-queue'
import { UserExportType } from '@lib/redis-queue/redis-queue.variable'
import { UserService } from '@lib/user'
import { User } from '@lib/user/entities/user.entity'
import { UserStatus } from '@lib/user/enum/user.enum'
import { ICreateBotDto } from '@lib/user/interfaces/user.interface'
import { IDataById } from '@lib/util/util.interface'
import { Injectable, Logger } from '@nestjs/common'
import { classToPlain } from 'class-transformer'
import {
  IBanUser,
  IUnbanUser,
  IUserByEmail,
  IUserByEmails,
  IUserByIds,
  IUserFilterForManagement,
  IUserFilterMarketing,
  IValidateOtpDto,
  UserExportTypeInterface,
} from './internal-user.interface'

@Injectable()
export class InternalUserService {
  private readonly logger = new Logger(InternalUserService.name)
  private readonly JOB_STATUS_PROCESSING: number = 1
  private readonly JOB_STATUS_SUCCEED: number = 2
  private readonly JOB_STATUS_FAILED: number = 3

  constructor(
    private readonly redisQueueService: RedisQueueService,
    private readonly userService: UserService,
    private readonly authenticatorOtpService: AuthenticatorOtpService,
    private readonly blacklistUserService: BlacklistUserService,
  ) {}

  async findOne(userById: IDataById) {
    const user = await this.userService.getUserById(userById.id)
    return user || {}
  }

  async findByIds(userByIds: IUserByIds) {
    const users = await this.userService.getUserByIds(userByIds.ids || [])
    const promises = users.map((user) => this.addIsBannedToUser(user))
    return await Promise.all(promises)
  }

  async findByEmails(userByEmails: IUserByEmails) {
    const users = await this.userService.getUserByEmails(
      userByEmails.emails || [],
    )
    const promises = users.map((user) => this.addIsBannedToUser(user))
    return await Promise.all(promises)
  }

  async findByEmail(userByEmail: IUserByEmail) {
    const user = await this.userService.getUserByEmail(userByEmail.email)
    return { data: user }
  }

  private async addIsBannedToUser(user: User) {
    const plainUser = classToPlain(user, {
      ignoreDecorators: true,
    })
    const checkBlacklist = await this.blacklistUserService.checkUserBlacklisted(
      user.id,
    )
    plainUser.isBanned = checkBlacklist ? 1 : 0
    return plainUser
  }

  async getUsersExport(filter: UserExportTypeInterface) {
    try {
      const defaultEmptyResponse = {
        status: 'success',
        message: '',
        data: {
          isEmpty: true,
        },
      }

      const job = await this.redisQueueService.getLastExportUserJob(
        UserExportType[filter.type],
      )

      if (!job) {
        return defaultEmptyResponse
      }

      return {
        status: 'success',
        message: '',
        data: {
          isEmpty: false,
          status: !job.finishedOn
            ? this.JOB_STATUS_PROCESSING
            : job.failedReason
            ? this.JOB_STATUS_FAILED
            : this.JOB_STATUS_SUCCEED,
          link: job.returnvalue?.link ? job.returnvalue?.link : '',
          createdAt: job.timestamp.toString(),
          finishedAt: job.finishedOn ? job.finishedOn.toString() : '',
        },
      }
    } catch (error) {
      return {
        status: 'failed',
        message: '',
        data: {
          isEmpty: true,
        },
      }
    }
  }

  async addExportUserProcess(userFilter: IUserFilterForManagement) {
    const addedJob = await this.redisQueueService.addExportUserJob(userFilter)

    return {
      status: 'success',
      message: '',
      data: {
        success: addedJob,
      },
    }
  }

  async addExportUserMarketingProcess(userFilter: IUserFilterMarketing) {
    const addedJob = await this.redisQueueService.addExportUserTagJob(
      userFilter,
    )

    return {
      status: 'success',
      message: '',
      data: {
        success: addedJob,
      },
    }
  }

  async banUser(banUser: IBanUser) {
    const banUserResponse = {} as IPostResponse

    const user = await this.userService.getUserById(banUser.id)
    if (!user) {
      banUserResponse.success = false
      banUserResponse.message = 'USER_NOT_FOUND'
      return banUserResponse
    }

    const isBanned = await this.blacklistUserService.checkUserBlacklisted(
      banUser.id,
    )

    if (isBanned) {
      banUserResponse.success = false
      banUserResponse.message = 'ALREADY_BANNED'
      return banUserResponse
    }

    const until = await this.blacklistUserService.banUser(
      banUser.id,
      banUser.hour,
      banUser.note,
    )
    await this.userService.logoutAllDevices(banUser.id)

    this.redisQueueService.addUserBanJob({
      userId: user.id,
      note: banUser.note,
      until,
    })

    banUserResponse.success = true
    banUserResponse.message = 'DONE'
    return banUserResponse
  }

  async unbanUser(unbanUser: IUnbanUser) {
    const unbanResponse = {} as IPostResponse

    const user = await this.userService.getUserById(unbanUser.id)
    if (!user) {
      unbanResponse.success = false
      unbanResponse.message = 'USER_NOT_FOUND'
      return unbanResponse
    }

    const isBanned = await this.blacklistUserService.checkUserBlacklisted(
      unbanUser.id,
    )

    if (!isBanned) {
      unbanResponse.success = false
      unbanResponse.message = 'ALREADY_UNBAN'
      return unbanResponse
    }

    await this.blacklistUserService.unbanUser(unbanUser.id)

    this.redisQueueService.addUserUnbanJob({
      userId: user.id,
    })

    unbanResponse.success = true
    unbanResponse.message = 'DONE'
    return unbanResponse
  }

  async createBot(createBotDto: ICreateBotDto) {
    const existCheck = await this.userService.checkEmailExist(
      createBotDto.email,
    )
    if (existCheck.exist) {
      return {
        success: false,
        message: existCheck.response?.message,
      }
    }
    const data = await this.userService.createBot(createBotDto)
    return { success: true, data }
  }

  async validateAuthenticatorOtp(validateOtpDto: IValidateOtpDto) {
    const { userId, otp } = validateOtpDto
    try {
      const user = await this.userService.getUserByIdWithPrivateField(userId)
      await this.authenticatorOtpService.validateAuthenticatorOtp(otp, user)
      return { result: true }
    } catch (error) {
      return {
        result: false,
        message: error.message,
      }
    }
  }

  async resetAuthenticator(userId: string) {
    try {
      const user = await this.userService.getUserById(userId)
      if (user && user.isAuthenticatorVerified) {
        await this.userService.disableAuthenticator(user)
      }
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  async changeEmail(userId: string, email: string) {
    try {
      const user = await this.userService.getUserById(userId)
      if (user.status != UserStatus.ACTIVE) {
        return {
          success: false,
          message: 'User is not active',
        }
      }
      const existingUserCheck = await this.userService.checkEmailExist(
        email,
        userId,
      )
      if (existingUserCheck.exist) {
        return {
          success: false,
          message: 'Email has been taken by other user',
        }
      }
      await this.userService.changeEmail(user, email, false)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
}
