import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { UserKycAdminDecision } from './entities/user-kyc-admin-decision.entity'
import { UserKycAdminService } from './user-kyc-admin.service'

describe('UserKycAdminService', () => {
  let service: UserKycAdminService

  beforeEach(async () => {
    const UserKycAdminDecisionRepositoryProvider =
      createMockRepositoryProvider(UserKycAdminDecision)
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserKycAdminService, UserKycAdminDecisionRepositoryProvider],
    }).compile()

    service = module.get<UserKycAdminService>(UserKycAdminService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
