import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { BusinessException } from '@lib/util'
import { AddAuthenticatorError } from '@lib/util'
import { User } from '@lib/user/entities/user.entity'
import { UserService } from '@lib/user'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { GenerateAuthenticatorInfoDto } from './dto/generate-authenticator-info.dto'
import { AuthenticatorOtpServiceMock } from 'apps/test/mock/common/authenticator-otp.service.mock'
import { AuthenticatorOtpService } from '@lib/otp'
import { AuthenticatorService } from './authenticator.service'

const userId = '1'

describe('AuthenticatorService', () => {
  let service: AuthenticatorService
  let userServiceMock: UserService

  beforeEach(async () => {
    const UserServiceMockProvider = {
      provide: UserService,
      useClass: UsersServiceMock,
    }
    const AuthenticatorOtpServiceMockProvider = {
      provide: AuthenticatorOtpService,
      useClass: AuthenticatorOtpServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AuthenticatorService,
        UserServiceMockProvider,
        AuthenticatorOtpServiceMockProvider,
      ],
    }).compile()

    service = module.get<AuthenticatorService>(AuthenticatorService)
    userServiceMock = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateAuthenticatorInfo', () => {
    it('should throw exception when user already verified authenticator', async () => {
      const user = new User()
      user.isAuthenticatorVerified = true
      jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(user)
      expect.hasAssertions()
      try {
        await service.generateAuthenticatorInfo(
          userId,
          new GenerateAuthenticatorInfoDto(),
        )
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(
          AddAuthenticatorError.AUTHENTICATOR_ALREADY_VERIFIED.message,
        )
      }
    })

    it('should throw exception when password is wrong', async () => {
      const user = new User()
      user.isAuthenticatorVerified = false
      jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(user)
      jest
        .spyOn(userServiceMock, 'checkPasswordWithUserId')
        .mockResolvedValue(false)
      expect.hasAssertions()
      try {
        await service.generateAuthenticatorInfo(
          userId,
          new GenerateAuthenticatorInfoDto(),
        )
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(AddAuthenticatorError.WRONG_PASSWORD.message)
      }
    })

    it('should return info when all condition is valid', async () => {
      const user = new User()
      user.isAuthenticatorVerified = false
      const secret = '124234234'
      jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(user)
      jest
        .spyOn(userServiceMock, 'checkPasswordWithUserId')
        .mockResolvedValue(true)
      jest
        .spyOn(userServiceMock, 'getOtpSecretByUserId')
        .mockResolvedValue(secret)
      expect(
        service.generateAuthenticatorInfo(
          userId,
          new GenerateAuthenticatorInfoDto(),
        ),
      ).resolves.toEqual({ secret })
    })
  })
})
