import { Test, TestingModule } from '@nestjs/testing'
import { AdminListener } from './admin-listener'

describe('AdminListener', () => {
  let provider: AdminListener

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminListener],
    }).compile()

    provider = module.get<AdminListener>(AdminListener)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
