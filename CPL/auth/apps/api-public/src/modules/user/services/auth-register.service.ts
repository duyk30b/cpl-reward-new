import { ConflictException, Injectable, Logger } from '@nestjs/common'
import { AuthRegisterDto } from '../dto/auth-register.dto'
import { BusinessException, formatEmail, VerifyAccountError } from '@lib/util'
import { CreateDeviceDto } from '@lib/device/dto/create-device.dto'
import { UserService } from '@lib/user'
import { DeviceService } from '@lib/device'
import { DeviceMapService } from '@lib/device'
import { OtpService, EOtpBusiness } from '@lib/otp'
import { RedisQueueService } from '@lib/redis-queue'
import { RedisLockService } from '@lib/redis/redis-lock.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthRegisterService {
  private readonly logger = new Logger(AuthRegisterService.name)
  private readonly ignoreEmailDomains: string[]
  constructor(
    private readonly usersService: UserService,
    private readonly devicesService: DeviceService,
    private readonly deviceMapService: DeviceMapService,
    private readonly otpService: OtpService,
    private readonly redisQueueService: RedisQueueService,
    private readonly redisLockService: RedisLockService,
    private readonly configService: ConfigService,
  ) {
    this.ignoreEmailDomains = this.configService.get('ignore_email_domains')
  }

  async create(
    authRegisterDto: AuthRegisterDto,
    deviceInfo: string,
    deviceHash: string,
    ip: string,
    lang = 'en',
  ) {
    const lock = await this.redisLockService
      .acquire(
        [
          `register:email:${formatEmail(
            authRegisterDto.email,
            this.ignoreEmailDomains,
          )}`,
        ],
        5000,
        {
          retryCount: 20,
          retryDelay: 1000,
          retryJitter: 500,
        },
      )
      .catch((e) => {
        this.logger.warn(e)
        throw new ConflictException()
      })

    try {
      // Check if user is existed
      const existingUserCheck = await this.usersService.checkEmailExist(
        authRegisterDto.email,
      )
      if (existingUserCheck.exist) {
        throw new BusinessException(existingUserCheck.response)
      }

      await this.otpService.validateOtp(
        authRegisterDto.otp,
        authRegisterDto.email,
        EOtpBusiness.VERIFY_EMAIL,
        new BusinessException(VerifyAccountError.WRONG_OTP),
      )

      const createdUser = await this.usersService.create(authRegisterDto)

      await this.otpService.markUsedOtp(
        authRegisterDto.email,
        EOtpBusiness.VERIFY_EMAIL,
      )

      // New device
      const createDeviceDto = new CreateDeviceDto()
      createDeviceDto.deviceInfo = deviceInfo
      createDeviceDto.deviceHash = deviceHash
      const createdDevice = await this.devicesService.createIfNotExist(
        createDeviceDto,
      )

      await this.redisQueueService.addUserCreatedJob({
        userId: createdUser.id,
        lang,
      })

      this.redisQueueService.addUserLoginJob({
        userId: createdUser.id,
        user: createdUser,
        device: createdDevice,
        ip,
        lang,
        isRegister: true,
        time: Date.now(),
      })

      return { user: createdUser, device: createdDevice }
    } finally {
      await lock.release().catch((e) => this.logger.warn(e))
    }
  }
}
