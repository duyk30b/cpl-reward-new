import { Test, TestingModule } from '@nestjs/testing'
import { BalanceAccountService } from './balance-account.service'

describe('BalanceAccountService', () => {
  let service: BalanceAccountService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceAccountService],
    }).compile()

    service = module.get<BalanceAccountService>(BalanceAccountService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
