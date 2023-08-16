import { Test, TestingModule } from '@nestjs/testing'
import { ApiExchangeSettingController } from './api-exchange-setting.controller'

describe('ApiExchangeSettingController', () => {
  let controller: ApiExchangeSettingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiExchangeSettingController],
    }).compile()

    controller = module.get<ApiExchangeSettingController>(
      ApiExchangeSettingController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
