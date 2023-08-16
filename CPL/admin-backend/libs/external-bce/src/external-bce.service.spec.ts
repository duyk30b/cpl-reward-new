import { Test, TestingModule } from '@nestjs/testing'
import { ExternalBceService } from './external-bce.service'

describe('ExternalBceService', () => {
  let service: ExternalBceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalBceService],
    }).compile()

    service = module.get<ExternalBceService>(ExternalBceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
