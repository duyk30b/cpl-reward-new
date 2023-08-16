import { Test, TestingModule } from '@nestjs/testing'
import { MarketMakerService } from './market-maker.service'

describe('MarketMakerService', () => {
  let service: MarketMakerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketMakerService],
    }).compile()

    service = module.get<MarketMakerService>(MarketMakerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
