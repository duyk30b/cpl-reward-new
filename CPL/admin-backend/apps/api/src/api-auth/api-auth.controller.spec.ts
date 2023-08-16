import { Test, TestingModule } from '@nestjs/testing'
import { ApiAuthController } from './api-auth.controller'
import { ApiAuthService } from './api-auth.service'

describe('ApiAuthController', () => {
  let controller: ApiAuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiAuthController],
      providers: [ApiAuthService],
    }).compile()

    controller = module.get<ApiAuthController>(ApiAuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
