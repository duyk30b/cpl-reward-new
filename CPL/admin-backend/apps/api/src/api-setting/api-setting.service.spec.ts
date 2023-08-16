import { Test, TestingModule } from '@nestjs/testing'
import { ApiSettingService } from './api-setting.service'

describe('ApiSettingService', () => {
  let service: ApiSettingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiSettingService],
    }).compile()

    service = module.get<ApiSettingService>(ApiSettingService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
