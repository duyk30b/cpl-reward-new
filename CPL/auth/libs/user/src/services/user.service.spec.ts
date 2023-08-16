import { DeviceMapService } from '@lib/device'
import { RedisService } from '@lib/redis'
import { createMockRepositoryProvider } from '@lib/util'
import { HttpService } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserService } from './user.service'

const user = new User()
user.id = '1'
user.email = 'test@gmail.com'
user.password = 'yxmRjcZ1Oqr1sOoc6uUPy15mRW2DAeRXRd4L5Ct7cz8='
user.salt = '5de78'

describe('UsersService', () => {
  let service: UserService
  let userRepositoryMock: Repository<User>

  beforeEach(async () => {
    const UserRepositoryProvider = createMockRepositoryProvider(User)
    const DeviceMapServiceMockProvider = {
      provide: DeviceMapService,
      useValue: {},
    }
    const RedisServiceMockProvider = {
      provide: RedisService,
      useValue: {},
    }
    const HttpServiceMockProvider = {
      provide: HttpService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        UserService,
        UserRepositoryProvider,
        DeviceMapServiceMockProvider,
        RedisServiceMockProvider,
        HttpServiceMockProvider,
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    userRepositoryMock = module.get(getRepositoryToken(User))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getUserById', () => {
    it('should return an user', () => {
      const userId = '1'
      const userRepositoryMockSpy = jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockResolvedValue(user)
      expect(service.getUserById(userId)).resolves.toEqual(user)
      expect(userRepositoryMockSpy).toHaveBeenCalledWith({ id: userId })
    })
  })

  describe('getUserByEmail', () => {
    it('should return an user', () => {
      const email = 'test@gmail.com'
      const userRepositoryMockSpy = jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockResolvedValue(user)
      expect(service.getUserByEmail(email)).resolves.toEqual(user)
      expect(userRepositoryMockSpy).toHaveBeenCalledWith({ email: email })
    })
  })

  describe('create', () => {
    it('should return an user', () => {
      const createUserDto = {
        email: 'test@gmail.com',
        password: '111111',
      }
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValue(user)
      expect(service.create(createUserDto)).resolves.toEqual(user)
    })
  })
})
