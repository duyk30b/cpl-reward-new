import { Test, TestingModule } from '@nestjs/testing'
import { ExportUserConsumers } from './export-user.consumers'

describe('ExportUserConsumers', () => {
  let provider: ExportUserConsumers

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportUserConsumers],
    }).compile()

    provider = module.get<ExportUserConsumers>(ExportUserConsumers)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
