import { Test, TestingModule } from '@nestjs/testing'
import { ApiChannelController } from './api-channel.controller'

describe('ApiChannelController', () => {
  let controller: ApiChannelController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiChannelController],
    }).compile()

    controller = module.get<ApiChannelController>(ApiChannelController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
