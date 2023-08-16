import { Test, TestingModule } from '@nestjs/testing'
import { ReasonCategoryService } from 'lib/reason'

describe('ReasonCategoryService', () => {
  let service: ReasonCategoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReasonCategoryService],
    }).compile()

    service = module.get<ReasonCategoryService>(ReasonCategoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
