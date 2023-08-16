import { Test, TestingModule } from '@nestjs/testing'
import { BanUserHistoryService } from './ban-user-history.service'

describe('BanUserHistoryService', () => {
  let service: BanUserHistoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanUserHistoryService],
    }).compile()

    service = module.get<BanUserHistoryService>(BanUserHistoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
