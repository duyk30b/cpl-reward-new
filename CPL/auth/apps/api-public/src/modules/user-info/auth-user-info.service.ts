import { ConflictException, Injectable, Logger } from '@nestjs/common'
import { BusinessException } from '@lib/util'
import { UserInfoError } from '@lib/util'
import { UserInfoHistoryDto } from '@lib/user/dto/user-info-history.dto'
import { UserInfoDto } from '@lib/user/dto/user-info.dto'
import { UserKycVerifyStatus } from '@lib/user/enum/user.enum'
import { UserInfoHistoryService } from '@lib/user'
import { UserInfoService } from '@lib/user'
import { UserService } from '@lib/user'
import { plainToClass } from 'class-transformer'
import { AuthUserInfoDto } from './dto/auth-user-info.dto'
import { UserInfo } from '@lib/user/entities/user-info.entity'
import { RedisQueueService } from '@lib/redis-queue'
import { RedisLockService } from '@lib/redis/redis-lock.service'

@Injectable()
export class AuthUserInfoService {
  private readonly logger = new Logger(AuthUserInfoService.name)
  constructor(
    private readonly userInfoService: UserInfoService,
    private readonly userInfoHistoryService: UserInfoHistoryService,
    private readonly userService: UserService,
    private readonly redisQueueService: RedisQueueService,
    private readonly redisLockService: RedisLockService,
  ) {}

  async registerUserInfo(userId: string, authUserInfoDto: AuthUserInfoDto) {
    const lock = await this.redisLockService
      .acquire([`user_info:${userId}`], 5000, {
        retryCount: 20,
        retryDelay: 1000,
        retryJitter: 500,
      })
      .catch((e) => {
        this.logger.warn(e)
        throw new ConflictException()
      })

    try {
      const user = await this.userService.getUserById(userId)
      // if (user.kycVerifyStatus == UserKycVerifyStatus.PENDING) {
      //   throw new BusinessException(UserInfoError.INFO_SUBMITTED)
      // }

      // const duplicate = await this.userInfoService.checkDuplicateInfo(
      //   authUserInfoDto,
      //   userId,
      // )
      // if (duplicate) {
      //   throw new BusinessException(UserInfoError.DUPLICATE_INFO)
      // }

      const existingInfo = await this.userInfoService.getInfoByUserId(userId)
      // if (existingInfo) {
      //   throw new BusinessException(UserInfoError.INFO_EXISTED)
      // }

      if (
        user.kycVerifyStatus == UserKycVerifyStatus.PENDING ||
        user.kycVerifyStatus == UserKycVerifyStatus.VERIFIED
      ) {
        const noChangeFields: Array<keyof UserInfo> = [
          'firstName',
          'lastName',
          'birthday',
          'nationalityId',
          'furigana1',
          'furigana2',
        ]
        const invalidChange = noChangeFields.some(
          (field) => existingInfo[field] != authUserInfoDto[field],
        )
        if (invalidChange) {
          throw new BusinessException(
            UserInfoError.CAN_NOT_CHANGE_FIELD_AFTER_VERIFIED,
          )
        }
      }

      const userInfoHistoryDto = plainToClass(
        UserInfoHistoryDto,
        {
          ...authUserInfoDto,
          isModifiedByUser: true,
        },
        {
          excludeExtraneousValues: true,
        },
      )
      userInfoHistoryDto.userId = userId
      const userInfoHistory =
        await this.userInfoHistoryService.saveUserInfoHistory(
          userInfoHistoryDto,
        )

      const userInfoDto = plainToClass(UserInfoDto, authUserInfoDto, {
        excludeExtraneousValues: true,
      })
      userInfoDto.userId = userId
      userInfoDto.userInfoHistoryId = userInfoHistory.id
      if (existingInfo) userInfoDto.id = existingInfo.id
      const userInfo = await this.userInfoService.saveUserInfo(userInfoDto)

      await this.userService.setUserInfoUpdated(userId)

      this.redisQueueService.addUserChangeInfoJob({ userId })

      return userInfo
    } finally {
      await lock.release().catch((e) => this.logger.warn(e))
    }
  }

  async getUserInfo(userId: string) {
    const userInfo = await this.userInfoService.getInfoByUserId(userId)
    if (!userInfo) {
      throw new BusinessException(UserInfoError.INFO_NOT_FOUND)
    }
    return userInfo
  }

  async acceptLaw(userId: string) {
    await this.userService.acceptLaw(userId)
  }
}
