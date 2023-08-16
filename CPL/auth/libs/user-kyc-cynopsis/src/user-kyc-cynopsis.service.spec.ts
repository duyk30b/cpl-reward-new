import { createMockRepositoryProvider } from '@lib/util'
import { Test, TestingModule } from '@nestjs/testing'
import { UserKycCynopsis } from './entities/user-kyc-cynopsis.entity'
import { UserKycCynopsisService } from './user-kyc-cynopsis.service'

describe('UserKyc3rdPartyService', () => {
  let service: UserKycCynopsisService

  beforeEach(async () => {
    const UserKycCynopsisRepositoryProvider =
      createMockRepositoryProvider(UserKycCynopsis)
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserKycCynopsisService, UserKycCynopsisRepositoryProvider],
    }).compile()

    service = module.get<UserKycCynopsisService>(UserKycCynopsisService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
