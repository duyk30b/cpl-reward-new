import { Test, TestingModule } from '@nestjs/testing'
import { ApiRewardLogService } from './api-reward-log.service'

describe('ApiRewardLogService', () => {
  let service: ApiRewardLogService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiRewardLogService],
    }).compile()

    service = module.get<ApiRewardLogService>(ApiRewardLogService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
