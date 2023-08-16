import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { UserInfo } from '../entities/user-info.entity'
import { UserInfoService } from './user-info.service'

describe('UserInfoService', () => {
  let service: UserInfoService

  beforeEach(async () => {
    const UserInfoRepositoryProvider = createMockRepositoryProvider(UserInfo)
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInfoService, UserInfoRepositoryProvider],
    }).compile()

    service = module.get<UserInfoService>(UserInfoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
