import { Test, TestingModule } from '@nestjs/testing'
import { AuthLoginHistoryController } from './auth-login-history.controller'
import { AuthLoginHistoryService } from './auth-login-history.service'

describe('AuthLoginHistoryController', () => {
  let controller: AuthLoginHistoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthLoginHistoryController],
      providers: [AuthLoginHistoryService],
    }).compile()

    controller = module.get<AuthLoginHistoryController>(
      AuthLoginHistoryController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
