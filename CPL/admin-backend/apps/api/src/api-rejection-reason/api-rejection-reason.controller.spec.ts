import { Test, TestingModule } from '@nestjs/testing'
import { ApiRejectionReasonController } from './api-rejection-reason.controller'
import { ApiRejectionReasonService } from './api-rejection-reason.service'

describe('ApiRejectionReasonController', () => {
  let controller: ApiRejectionReasonController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiRejectionReasonController],
      providers: [ApiRejectionReasonService],
    }).compile()

    controller = module.get<ApiRejectionReasonController>(
      ApiRejectionReasonController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
