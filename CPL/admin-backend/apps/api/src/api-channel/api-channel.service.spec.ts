import { Test, TestingModule } from '@nestjs/testing'
import { ApiChannelService } from './api-channel.service'

describe('ApiChannelService', () => {
  let service: ApiChannelService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiChannelService],
    }).compile()

    service = module.get<ApiChannelService>(ApiChannelService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
