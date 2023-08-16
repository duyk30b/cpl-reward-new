import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { FlowLog } from '../entities/flow-log.entity'
import { FlowStatus } from '../enum/flows.enum'
import { FlowLogsService } from './flow-logs.service'

describe('FlowLogsService', () => {
  let service: FlowLogsService

  const flowLog = new FlowLog()
  flowLog.flowId = 1
  flowLog.status = FlowStatus.RUNNING

  beforeEach(async () => {
    const FlowLogRepositoryProvider = createMockRepositoryProvider(FlowLog)
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowLogsService, FlowLogRepositoryProvider],
    }).compile()

    service = module.get<FlowLogsService>(FlowLogsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
