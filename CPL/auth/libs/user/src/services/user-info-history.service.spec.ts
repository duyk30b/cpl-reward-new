import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { UserInfoHistory } from '../entities/user-info-history.entity'
import { UserInfoHistoryService } from './user-info-history.service'

describe('UserInfoHistoryService', () => {
  let service: UserInfoHistoryService

  beforeEach(async () => {
    const UserInfoHistoryRepositoryProvider =
      createMockRepositoryProvider(UserInfoHistory)
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInfoHistoryService, UserInfoHistoryRepositoryProvider],
    }).compile()

    service = module.get<UserInfoHistoryService>(UserInfoHistoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
