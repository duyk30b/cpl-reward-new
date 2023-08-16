import { Test, TestingModule } from '@nestjs/testing'
import { ApiUserKycService } from './api-user-kyc.service'

describe('ApiUserKycService', () => {
  let service: ApiUserKycService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiUserKycService],
    }).compile()

    service = module.get<ApiUserKycService>(ApiUserKycService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
