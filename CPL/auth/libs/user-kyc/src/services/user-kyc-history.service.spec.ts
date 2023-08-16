import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { UserKycHistory } from '../entities/user-kyc-history.entity'
import { UserKycHistoryService } from './user-kyc-history.service'

describe('UserKycHistoryService', () => {
  let service: UserKycHistoryService

  beforeEach(async () => {
    const UserKycHistoryRepositoryProvider =
      createMockRepositoryProvider(UserKycHistory)
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserKycHistoryService, UserKycHistoryRepositoryProvider],
    }).compile()

    service = module.get<UserKycHistoryService>(UserKycHistoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
