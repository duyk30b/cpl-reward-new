import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { BusinessException } from '@lib/util'
import { BlacklistError, LoginError } from '@lib/util'
import { BlacklistUserService } from '@lib/blacklist'
import { Device } from '@lib/device/entities/device.entity'
import { DeviceMapService } from '@lib/device'
import { DeviceService } from '@lib/device'
import { User } from '@lib/user/entities/user.entity'
import { UserService } from '@lib/user'
// import { CaptchaServiceMock } from 'apps/test/mock/authenticate/captcha.service.mock'
import { BlacklistUserServiceMock } from 'apps/test/mock/common/blacklist-user.service.mock'
import { DeviceMapServiceMock } from 'apps/test/mock/common/device-map.service.mock'
import { DevicesServiceMock } from 'apps/test/mock/common/devices.service.mock'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { AuthLoginDto } from '../dto/auth-login.dto'
import { AuthLoginService } from './auth-login.service'
import { NotificationService } from '@lib/grpc-client'
import { NotificationServiceMock } from 'apps/test/mock/common/notification.service.mock'
import { AuthenticatorOtpServiceMock } from 'apps/test/mock/common/authenticator-otp.service.mock'
import { AuthenticatorOtpService, OtpService } from '@lib/otp'
import { OtpServiceMock } from 'apps/test/mock/common/otp.service.mock'

const deviceInfo = 'test'
const deviceHash = 'test'
const ip = 'test'
const lang = 'en'
const user = new User()
const device = new Device()

const noOtpLoginDto = new AuthLoginDto()
noOtpLoginDto.email = 'test@gmail.com'

const hasOtpLoginDto = new AuthLoginDto()
hasOtpLoginDto.email = 'test@gmail.com'
// hasOtpLoginDto.otp = 'otp'

describe('AuthLoginService', () => {
  let service: AuthLoginService
  let devicesServiceMock: DeviceService
  let deviceMapServiceMock: DeviceMapService
  let usersServiceMock: UserService
  let blacklistUserServiceMock: BlacklistUserService

  beforeEach(async () => {
    const DevicesServiceMockProvider = {
      provide: DeviceService,
      useClass: DevicesServiceMock,
    }
    const DeviceMapServiceMockProvider = {
      provide: DeviceMapService,
      useClass: DeviceMapServiceMock,
    }
    const UsersServiceMockProvider = {
      provide: UserService,
      useClass: UsersServiceMock,
    }
    const NotificationServiceMockProvider = {
      provide: NotificationService,
      useClass: NotificationServiceMock,
    }
    const BlacklistUserServiceMockProvider = {
      provide: BlacklistUserService,
      useClass: BlacklistUserServiceMock,
    }
    const AuthenticatorOtpServiceMockProvider = {
      provide: AuthenticatorOtpService,
      useClass: AuthenticatorOtpServiceMock,
    }
    const OtpServiceMockProvider = {
      provide: OtpService,
      useClass: OtpServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AuthLoginService,
        DevicesServiceMockProvider,
        DeviceMapServiceMockProvider,
        UsersServiceMockProvider,
        NotificationServiceMockProvider,
        BlacklistUserServiceMockProvider,
        AuthenticatorOtpServiceMockProvider,
        OtpServiceMockProvider,
      ],
    }).compile()

    service = module.get<AuthLoginService>(AuthLoginService)
    devicesServiceMock = module.get<DeviceService>(DeviceService)
    deviceMapServiceMock = module.get<DeviceMapService>(DeviceMapService)
    usersServiceMock = module.get<UserService>(UserService)
    blacklistUserServiceMock =
      module.get<BlacklistUserService>(BlacklistUserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    describe('when flow is valid', () => {
      it('should throw exception when missing both email and phone ', async () => {
        expect.hasAssertions()
        try {
          await service.login(
            new AuthLoginDto(),
            deviceInfo,
            deviceHash,
            ip,
            lang,
          )
        } catch (e) {
          expect(e).toBeInstanceOf(BusinessException)
          expect(e.message).toBe(
            LoginError.MISSING_BOTH_EMAIL_AND_PHONE.message,
          )
        }
      })

      it('should throw exception when user is not found', async () => {
        expect.hasAssertions()
        try {
          jest.spyOn(usersServiceMock, 'getLoginUser').mockResolvedValue(null)
          await service.login(noOtpLoginDto, deviceInfo, deviceHash, ip, lang)
        } catch (e) {
          expect(e).toBeInstanceOf(BusinessException)
          expect(e.message).toBe(LoginError.USER_DOES_NOT_EXIST.message)
        }
      })

      it('should throw exception when password is wrong', async () => {
        expect.hasAssertions()
        try {
          jest.spyOn(usersServiceMock, 'getLoginUser').mockResolvedValue(user)
          jest
            .spyOn(usersServiceMock, 'checkPasswordWithUser')
            .mockReturnValue(false)
          await service.login(noOtpLoginDto, deviceInfo, deviceHash, ip, lang)
        } catch (e) {
          expect(e).toBeInstanceOf(BusinessException)
          expect(e.message).toBe(LoginError.WRONG_PASSWORD.message)
        }
      })

      it('should throw exception when user is blacklisted', async () => {
        expect.hasAssertions()
        try {
          jest.spyOn(usersServiceMock, 'getLoginUser').mockResolvedValue(user)
          jest
            .spyOn(usersServiceMock, 'checkPasswordWithUser')
            .mockReturnValue(true)
          jest
            .spyOn(blacklistUserServiceMock, 'checkUserBlacklisted')
            .mockResolvedValue(true)
          await service.login(noOtpLoginDto, deviceInfo, deviceHash, ip, lang)
        } catch (e) {
          expect(e).toBeInstanceOf(BusinessException)
          expect(e.message).toBe(BlacklistError.USER_BLACKLISTED.message)
        }
      })

      it('should throw exception when user login with new device without otp', async () => {
        expect.hasAssertions()
        try {
          jest.spyOn(usersServiceMock, 'getLoginUser').mockResolvedValue(user)
          jest
            .spyOn(usersServiceMock, 'checkPasswordWithUser')
            .mockReturnValue(true)
          jest
            .spyOn(blacklistUserServiceMock, 'checkUserBlacklisted')
            .mockResolvedValue(false)
          jest
            .spyOn(devicesServiceMock, 'createIfNotExist')
            .mockResolvedValue(device)
          jest
            .spyOn(deviceMapServiceMock, 'checkUserHasDevice')
            .mockResolvedValue(false)
          await service.login(noOtpLoginDto, deviceInfo, deviceHash, ip, lang)
        } catch (e) {
          expect(e).toBeInstanceOf(BusinessException)
          expect(e.message).toBe(LoginError.NEED_EMAIL_OTP.message)
        }
      })

      it('should return user and device when all info are correct', async () => {
        jest.spyOn(usersServiceMock, 'getLoginUser').mockResolvedValue(user)
        jest
          .spyOn(usersServiceMock, 'checkPasswordWithUser')
          .mockReturnValue(true)
        jest
          .spyOn(blacklistUserServiceMock, 'checkUserBlacklisted')
          .mockResolvedValue(false)
        jest
          .spyOn(devicesServiceMock, 'createIfNotExist')
          .mockResolvedValue(device)
        jest
          .spyOn(deviceMapServiceMock, 'checkUserHasDevice')
          .mockResolvedValue(true)
        expect(
          service.login(hasOtpLoginDto, deviceInfo, deviceHash, ip, lang),
        ).resolves.toEqual({
          user: user,
          device: device,
        })
      })
    })
  })
})
