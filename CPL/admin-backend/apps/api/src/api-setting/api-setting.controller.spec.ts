import { Test, TestingModule } from '@nestjs/testing'
import { ApiSettingController } from './api-setting.controller'

describe('ApiSettingController', () => {
  let controller: ApiSettingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiSettingController],
    }).compile()

    controller = module.get<ApiSettingController>(ApiSettingController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
