import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { UserKyc } from '../entities/user-kyc.entity'
import { UserKycService } from './user-kyc.service'

describe('UserKycService', () => {
  let service: UserKycService

  beforeEach(async () => {
    const UserKycRepositoryProvider = createMockRepositoryProvider(UserKyc)
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserKycService, UserKycRepositoryProvider],
    }).compile()

    service = module.get<UserKycService>(UserKycService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
