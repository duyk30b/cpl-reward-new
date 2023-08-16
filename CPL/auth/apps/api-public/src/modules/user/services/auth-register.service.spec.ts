import { Test, TestingModule } from '@nestjs/testing'
import { BusinessException } from '@lib/util'
import { EmailExistError } from '@lib/util'
import { Device } from '@lib/device/entities/device.entity'
import { DeviceMapService } from '@lib/device'
import { DeviceService } from '@lib/device'
import { User } from '@lib/user/entities/user.entity'
import { UserService } from '@lib/user'
import { VerifyAccountServiceMock } from 'apps/test/mock/authenticate/verify-account.service.mock'
import { DeviceMapServiceMock } from 'apps/test/mock/common/device-map.service.mock'
import { DevicesServiceMock } from 'apps/test/mock/common/devices.service.mock'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { AuthRegisterDto } from '../dto/auth-register.dto'
import { AuthRegisterService } from './auth-register.service'
import { VerifyAccountService } from './verify-account.service'
import { OtpService } from '@lib/otp'
import { OtpServiceMock } from 'apps/test/mock/common/otp.service.mock'

const deviceInfo = 'test'
const deviceHash = 'test'
const ip = 'test'
const user = new User()
const device = new Device()

describe('RegisterService', () => {
  let service: AuthRegisterService
  let devicesServiceMock: DeviceService
  let usersServiceMock: UserService

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
    const VerifyAccountServiceMockProvider = {
      provide: VerifyAccountService,
      useClass: VerifyAccountServiceMock,
    }
    const OtpServiceMockProvider = {
      provide: OtpService,
      useClass: OtpServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRegisterService,
        DevicesServiceMockProvider,
        DeviceMapServiceMockProvider,
        UsersServiceMockProvider,
        VerifyAccountServiceMockProvider,
        OtpServiceMockProvider,
      ],
    }).compile()

    service = module.get<AuthRegisterService>(AuthRegisterService)
    devicesServiceMock = module.get<DeviceService>(DeviceService)
    usersServiceMock = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    describe('when flow is valid', () => {
      it('should throw exception when user is existed', async () => {
        expect.hasAssertions()
        try {
          jest.spyOn(usersServiceMock, 'checkEmailExist').mockResolvedValue({
            exist: true,
            response: EmailExistError.EXIST_IN_EMAIL,
          })
          await service.create(
            new AuthRegisterDto(),
            deviceInfo,
            deviceHash,
            ip,
          )
        } catch (e) {
          expect(e).toBeInstanceOf(BusinessException)
          expect(e.message).toBe(EmailExistError.EXIST_IN_EMAIL.message)
        }
      })

      it('should return new user when all info are correct', async () => {
        jest
          .spyOn(usersServiceMock, 'checkEmailExist')
          .mockResolvedValue({ exist: false })
        jest.spyOn(usersServiceMock, 'create').mockResolvedValue(user)
        jest
          .spyOn(devicesServiceMock, 'createIfNotExist')
          .mockResolvedValue(device)
        expect(
          service.create(new AuthRegisterDto(), deviceInfo, deviceHash, ip),
        ).resolves.toEqual({ user, device })
      })
    })
  })
})
