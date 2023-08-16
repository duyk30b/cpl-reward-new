import { Test, TestingModule } from '@nestjs/testing'
import { ReasonService } from 'lib/reason'

describe('RejectionReasonService', () => {
  let service: ReasonService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReasonService],
    }).compile()

    service = module.get<ReasonService>(ReasonService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
