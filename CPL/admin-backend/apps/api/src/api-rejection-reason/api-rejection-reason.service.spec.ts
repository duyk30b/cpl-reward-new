import { Test, TestingModule } from '@nestjs/testing'
import { ApiRejectionReasonService } from './api-rejection-reason.service'

describe('ApiRejectionReasonService', () => {
  let service: ApiRejectionReasonService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiRejectionReasonService],
    }).compile()

    service = module.get<ApiRejectionReasonService>(ApiRejectionReasonService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
