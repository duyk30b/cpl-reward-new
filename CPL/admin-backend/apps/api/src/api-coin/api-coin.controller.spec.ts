import { Test, TestingModule } from '@nestjs/testing'
import { ApiCoinController } from './api-coin.controller'

describe('ApiCoinController', () => {
  let controller: ApiCoinController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiCoinController],
    }).compile()

    controller = module.get<ApiCoinController>(ApiCoinController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
