import { Test, TestingModule } from '@nestjs/testing'
import { BusinessException } from '@lib/util'
import { ChangePasswordError } from '@lib/util'
import { User } from '@lib/user/entities/user.entity'
import { UserService } from '@lib/user'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { ChangePasswordDto } from '../dto/change-password.dto'
import { ChangePasswordService } from './change-password.service'

const userId = '1'

describe('ChangePasswordService', () => {
  let service: ChangePasswordService
  let usersServiceMock: UserService

  beforeEach(async () => {
    const UsersServiceMockProvider = {
      provide: UserService,
      useClass: UsersServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangePasswordService, UsersServiceMockProvider],
    }).compile()

    service = module.get<ChangePasswordService>(ChangePasswordService)
    usersServiceMock = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('changePassword', () => {
    it('should throw exception when no user found', async () => {
      jest
        .spyOn(usersServiceMock, 'getUserByIdWithPrivateField')
        .mockResolvedValue(null)
      expect.hasAssertions()
      try {
        await service.changePassword(userId, new ChangePasswordDto())
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(ChangePasswordError.USER_DOES_NOT_EXIST.message)
      }
    })

    it('should throw exception when password does not match', async () => {
      jest
        .spyOn(usersServiceMock, 'getUserByIdWithPrivateField')
        .mockResolvedValue(new User())
      jest
        .spyOn(usersServiceMock, 'checkPasswordWithUser')
        .mockReturnValue(false)
      expect.hasAssertions()
      try {
        await service.changePassword(userId, new ChangePasswordDto())
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(ChangePasswordError.WRONG_PASSWORD.message)
      }
    })

    it('should throw exception when new password is the same as old password', async () => {
      const changePasswordDto = new ChangePasswordDto()
      changePasswordDto.oldPassword = '111111'
      changePasswordDto.newPassword = '111111'
      jest
        .spyOn(usersServiceMock, 'getUserByIdWithPrivateField')
        .mockResolvedValue(new User())
      jest
        .spyOn(usersServiceMock, 'checkPasswordWithUser')
        .mockReturnValue(true)
      expect.hasAssertions()
      try {
        await service.changePassword(userId, changePasswordDto)
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException)
        expect(e.message).toBe(ChangePasswordError.SAME_AS_OLD_PASSWORD.message)
      }
    })

    it('should update user password when all infos is valid', async () => {
      const changePasswordDto = new ChangePasswordDto()
      changePasswordDto.oldPassword = '111111'
      changePasswordDto.newPassword = '123456'
      jest
        .spyOn(usersServiceMock, 'getUserByIdWithPrivateField')
        .mockResolvedValue(new User())
      jest
        .spyOn(usersServiceMock, 'checkPasswordWithUser')
        .mockReturnValue(true)
      expect(
        service.changePassword(userId, changePasswordDto),
      ).resolves.not.toThrow()
    })
  })
})
