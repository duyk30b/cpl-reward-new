import { Test, TestingModule } from '@nestjs/testing'
import { ApiRewardLogController } from './api-reward-log.controller'

describe('ApiRewardLogController', () => {
  let controller: ApiRewardLogController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiRewardLogController],
    }).compile()

    controller = module.get<ApiRewardLogController>(ApiRewardLogController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
