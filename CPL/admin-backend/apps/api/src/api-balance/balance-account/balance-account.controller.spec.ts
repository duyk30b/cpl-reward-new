import { Test, TestingModule } from '@nestjs/testing'
import { BalanceAccountController } from './balance-account.controller'

describe('BalanceAccountController', () => {
  let controller: BalanceAccountController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceAccountController],
    }).compile()

    controller = module.get<BalanceAccountController>(BalanceAccountController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
