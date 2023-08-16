import { Test, TestingModule } from '@nestjs/testing'
import { BusinessException } from '@lib/util'
import { AddEmailError, EmailExistError, VerifyAccountError } from '@lib/util'
import { AccessTokenService } from '@lib/authorization'
import { AuthorizationCodeService } from '@lib/authorization'
import { RefreshTokenService } from '@lib/authorization'
import { User } from '@lib/user/entities/user.entity'
import { UserService } from '@lib/user'
import { VerifyAccountServiceMock } from 'apps/test/mock/authenticate/verify-account.service.mock'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { AddEmailAuthenticationDto } from '../dto/add-email-authentication.dto'
import { AuthUserService } from './auth-user.service'
import { VerifyAccountService } from './verify-account.service'
import { ConfigModule } from '@nestjs/config'
import otp from 'config/otp'
import { NotificationService } from '@lib/grpc-client'
import { NotificationServiceMock } from 'apps/test/mock/common/notification.service.mock'
import { AuthenticatorOtpServiceMock } from 'apps/test/mock/common/authenticator-otp.service.mock'
import { AuthenticatorOtpService, OtpService } from '@lib/otp'
import { OtpServiceMock } from 'apps/test/mock/common/otp.service.mock'

const userId = '1'
const validUser = new User()
validUser.email = 'test@mail.com'

describe('AuthUserService', () => {
  let service: AuthUserService
  let userServiceMock: UserService
  let otpServiceMock: OtpService

  beforeEach(async () => {
    const AuthorizationCodeServiceMockProvider = {
      provide: AuthorizationCodeService,
      useValue: {},
    }
    const AccessTokenServiceMockProvider = {
      provide: AccessTokenService,
      useValue: {},
    }
    const RefreshTokenServiceMockProvider = {
      provide: RefreshTokenService,
      useValue: {},
    }
    const UserServiceMockProvider = {
      provide: UserService,
      useClass: UsersServiceMock,
    }
    const VerifyAccountServiceMockProvider = {
      provide: VerifyAccountService,
      useClass: VerifyAccountServiceMock,
    }
    const NotificationServiceMockProvider = {
      provide: NotificationService,
      useClass: NotificationServiceMock,
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
      imports: [ConfigModule.forRoot({ load: [otp] })],
      providers: [
        AuthUserService,
        AuthorizationCodeServiceMockProvider,
        AccessTokenServiceMockProvider,
        RefreshTokenServiceMockProvider,
        UserServiceMockProvider,
        VerifyAccountServiceMockProvider,
        NotificationServiceMockProvider,
        AuthenticatorOtpServiceMockProvider,
        OtpServiceMockProvider,
      ],
    }).compile()

    service = module.get<AuthUserService>(AuthUserService)
    userServiceMock = module.get<UserService>(UserService)
    otpServiceMock = module.get<OtpService>(OtpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('addEmailAuthentication', () => {
    it('should throw exception when user does not exist', async () => {
      jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(null)
      expect.hasAssertions()
      try {
        const addEmailAuthenticationDto = new AddEmailAuthenticationDto()
        await service.addEmailAuthentication(userId, addEmailAuthenticationDto)
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(AddEmailError.USER_DOES_NOT_EXIST.message)
      }
    })

    it('should throw exception when user already have an email', async () => {
      const user = new User()
      user.email = 'test1@gmail.com'
      jest
        .spyOn(userServiceMock, 'getUserByIdWithPrivateField')
        .mockResolvedValue(user)
      expect.hasAssertions()
      try {
        const addEmailAuthenticationDto = new AddEmailAuthenticationDto()
        await service.addEmailAuthentication(userId, addEmailAuthenticationDto)
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(AddEmailError.ALREADY_HAVE_AN_EMAIL.message)
      }
    })

    it('should throw exception when email has been taken', async () => {
      const user = new User()
      jest
        .spyOn(userServiceMock, 'getUserByIdWithPrivateField')
        .mockResolvedValue(user)
      jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
        exist: true,
        response: EmailExistError.EXIST_IN_EMAIL,
      })
      expect.hasAssertions()
      try {
        const addEmailAuthenticationDto = new AddEmailAuthenticationDto()
        await service.addEmailAuthentication(userId, addEmailAuthenticationDto)
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(EmailExistError.EXIST_IN_EMAIL.message)
      }
    })

    it('should throw exception when otp is invalid', async () => {
      const user = new User()
      const addEmailAuthenticationDto = new AddEmailAuthenticationDto()
      jest
        .spyOn(userServiceMock, 'getUserByIdWithPrivateField')
        .mockResolvedValue(user)
      jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
        exist: false,
      })
      jest.spyOn(otpServiceMock, 'validateOtp').mockImplementation(() => {
        throw new BusinessException(VerifyAccountError.WRONG_OTP)
      })
      expect.hasAssertions()
      try {
        await service.addEmailAuthentication(userId, addEmailAuthenticationDto)
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(VerifyAccountError.WRONG_OTP.message)
      }
    })

    it('should update user email if all condition is valid', async () => {
      const user = new User()
      const addEmailAuthenticationDto = new AddEmailAuthenticationDto()
      jest
        .spyOn(userServiceMock, 'getUserByIdWithPrivateField')
        .mockResolvedValue(user)
      jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
        exist: false,
      })
      const addEmailAuthenticationSpy = jest.spyOn(
        userServiceMock,
        'addEmailAuthentication',
      )
      addEmailAuthenticationSpy.mockResolvedValue(user)
      await service.addEmailAuthentication(userId, addEmailAuthenticationDto)
      expect(addEmailAuthenticationSpy).toHaveBeenCalledWith(
        user,
        addEmailAuthenticationDto,
      )
    })
  })

  // describe('sendChangeEmailOtp', () => {
  //   it('should throw exception when user does not have email', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(new User())
  //     expect.hasAssertions()
  //     try {
  //       await service.sendChangeEmailOtp(userId, new SendChangeEmailOtpDto())
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(
  //         ChangeEmailError.USER_DOES_NOT_HAVE_EMAIL.message,
  //       )
  //     }
  //   })

  //   it('should throw exception when new email is same as current email', async () => {
  //     const user = new User()
  //     user.email = 'test1@gmail.com'
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(user)
  //     expect.hasAssertions()
  //     try {
  //       const sendChangeEmailOtpDto = new SendChangeEmailOtpDto()
  //       sendChangeEmailOtpDto.newEmail = 'test1@gmail.com'
  //       await service.sendChangeEmailOtp(userId, sendChangeEmailOtpDto)
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(ChangeEmailError.SAME_AS_CURRENT_EMAIL.message)
  //     }
  //   })

  //   it('should throw exception when email has been taken', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(validUser)
  //     jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
  //       exist: true,
  //       response: EmailExistError.EXIST_IN_EMAIL,
  //     })
  //     expect.hasAssertions()
  //     try {
  //       await service.sendChangeEmailOtp(userId, new SendChangeEmailOtpDto())
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(EmailExistError.EXIST_IN_EMAIL.message)
  //     }
  //   })

  //   it('should success if all condition is valid', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(validUser)
  //     jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
  //       exist: false,
  //     })
  //     return expect(
  //       service.sendChangeEmailOtp(userId, new SendChangeEmailOtpDto()),
  //     ).resolves.not.toThrow()
  //   })
  // })

  // describe('changeEmail', () => {
  //   it('should throw exception when user does not have email', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(new User())
  //     expect.hasAssertions()
  //     try {
  //       await service.changeEmail(userId, new ChangeEmailDto())
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(
  //         ChangeEmailError.USER_DOES_NOT_HAVE_EMAIL.message,
  //       )
  //     }
  //   })

  //   it('should throw exception when new email is same as current email', async () => {
  //     const user = new User()
  //     user.email = 'test1@gmail.com'
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(user)
  //     expect.hasAssertions()
  //     try {
  //       const changeEmailDto = new ChangeEmailDto()
  //       changeEmailDto.newEmail = 'test1@gmail.com'
  //       await service.changeEmail(userId, changeEmailDto)
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(ChangeEmailError.SAME_AS_CURRENT_EMAIL.message)
  //     }
  //   })

  //   it('should throw exception when email has been taken', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(validUser)
  //     jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
  //       exist: true,
  //       response: EmailExistError.EXIST_IN_EMAIL,
  //     })
  //     expect.hasAssertions()
  //     try {
  //       await service.changeEmail(userId, new ChangeEmailDto())
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(EmailExistError.EXIST_IN_EMAIL.message)
  //     }
  //   })

  //   it('should throw exception when current email otp is invalid', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(validUser)
  //     jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
  //       exist: false,
  //     })
  //     jest.spyOn(helpers, 'validateOtp').mockReturnValueOnce(false)
  //     expect.hasAssertions()
  //     try {
  //       await service.changeEmail(userId, new ChangeEmailDto())
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(ChangeEmailError.WRONG_CURRENT_EMAIL_OTP.message)
  //     }
  //   })

  //   it('should throw exception when new email otp is invalid', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(validUser)
  //     jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
  //       exist: false,
  //     })
  //     jest.spyOn(helpers, 'validateOtp').mockReturnValueOnce(true)
  //     jest.spyOn(helpers, 'validateOtp').mockReturnValueOnce(false)
  //     expect.hasAssertions()
  //     try {
  //       await service.changeEmail(userId, new ChangeEmailDto())
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(ChangeEmailError.WRONG_NEW_EMAIL_OTP.message)
  //     }
  //   })

  //   it('should throw exception when password is invalid', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(validUser)
  //     jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
  //       exist: false,
  //     })
  //     jest.spyOn(helpers, 'validateOtp').mockReturnValueOnce(true)
  //     jest.spyOn(helpers, 'validateOtp').mockReturnValueOnce(true)
  //     jest
  //       .spyOn(userServiceMock, 'checkPasswordWithUserId')
  //       .mockResolvedValue(false)
  //     expect.hasAssertions()
  //     try {
  //       await service.changeEmail(userId, new ChangeEmailDto())
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(BusinessException)
  //       expect(e.message).toBe(ChangeEmailError.WRONG_PASSWORD.message)
  //     }
  //   })

  //   it('should success when all condition is valid', async () => {
  //     jest.spyOn(userServiceMock, 'getUserById').mockResolvedValue(validUser)
  //     jest.spyOn(userServiceMock, 'checkEmailExist').mockResolvedValue({
  //       exist: false,
  //     })
  //     jest.spyOn(helpers, 'validateOtp').mockReturnValueOnce(true)
  //     jest.spyOn(helpers, 'validateOtp').mockReturnValueOnce(true)
  //     jest
  //       .spyOn(userServiceMock, 'checkPasswordWithUserId')
  //       .mockResolvedValue(true)
  //     return expect(
  //       service.changeEmail(userId, new ChangeEmailDto()),
  //     ).resolves.not.toThrow()
  //   })
  // })
})
