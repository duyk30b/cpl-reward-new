import { Test, TestingModule } from '@nestjs/testing'
import { ApiLogController } from './api-log.controller'

describe('ApiLogController', () => {
  let controller: ApiLogController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiLogController],
    }).compile()

    controller = module.get<ApiLogController>(ApiLogController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
