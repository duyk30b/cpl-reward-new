import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { Flow } from '../entities/flow.entity'
import { FlowService } from './flow.service'

describe('FlowService', () => {
  let service: FlowService

  beforeEach(async () => {
    const FlowRepositoryProvider = createMockRepositoryProvider(Flow)
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowService, FlowRepositoryProvider],
    }).compile()

    service = module.get<FlowService>(FlowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
