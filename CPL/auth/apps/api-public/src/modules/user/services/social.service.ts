import { ConflictException, Injectable, Logger } from '@nestjs/common'
import { BusinessException } from '@lib/util'
import { LoginError, BlacklistError } from '@lib/util'
import { BlacklistUserService } from '@lib/blacklist'
import { CreateDeviceDto } from '@lib/device/dto/create-device.dto'
import { DeviceMapService } from '@lib/device'
import { DeviceService } from '@lib/device'
import { UserStatus } from '@lib/user/enum/user.enum'
import { UserService } from '@lib/user'
import { FirebaseDto } from '../dto/firebase.dto'
import { RedisQueueService } from '@lib/redis-queue'
import { RedisLockService } from '@lib/redis/redis-lock.service'
import { FirebaseService } from '@lib/firebase'

@Injectable()
export class SocialService {
  private readonly logger = new Logger(SocialService.name)
  constructor(
    private readonly usersService: UserService,
    private readonly devicesService: DeviceService,
    private readonly deviceMapService: DeviceMapService,
    private readonly blacklistUserService: BlacklistUserService,
    private readonly redisQueueService: RedisQueueService,
    private readonly redisLockService: RedisLockService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async firebase(
    firebaseDto: FirebaseDto,
    deviceInfo: string,
    deviceHash: string,
    ip: string,
    lang = 'en',
  ) {
    const firebaseUser = await this.firebaseService.validateIdToken(firebaseDto)

    const lock = await this.redisLockService
      .acquire([`register:social:${firebaseUser.firebaseId}`], 5000, {
        retryCount: 20,
        retryDelay: 1000,
        retryJitter: 500,
      })
      .catch((e) => {
        this.logger.warn(e)
        throw new ConflictException()
      })

    try {
      const { isNewUser, user } =
        await this.usersService.loginOrRegisterByFirebase({
          ...firebaseUser,
          referrer: firebaseDto.referrer,
        })

      if (user.status == UserStatus.INACTIVE) {
        throw new BusinessException(LoginError.INACTIVE_USER)
      }

      const userBlacklisted =
        await this.blacklistUserService.checkUserBlacklisted(user.id)

      if (userBlacklisted)
        throw new BusinessException(BlacklistError.USER_BLACKLISTED)

      if (user.requestDeleteAt) {
        throw new BusinessException(LoginError.USER_BEING_DELETED)
      }

      const createDeviceDto = new CreateDeviceDto()
      createDeviceDto.deviceInfo = deviceInfo
      createDeviceDto.deviceHash = deviceHash
      const device = await this.devicesService.createIfNotExist(createDeviceDto)

      if (isNewUser) {
        await this.redisQueueService.addUserCreatedJob({
          userId: user.id,
          lang,
        })
      }

      this.redisQueueService.addUserLoginJob({
        userId: user.id,
        user,
        device,
        ip,
        lang,
        isRegister: isNewUser,
        time: Date.now(),
      })

      return {
        user: user,
        device: device,
      }
    } finally {
      await lock.release().catch((e) => this.logger.warn(e))
    }
  }
}
