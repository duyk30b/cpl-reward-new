import { Test, TestingModule } from '@nestjs/testing'
import { FlowService } from '@lib/flows'
import { AuthFlowController } from './auth-flow.controller'
import { AuthFlowService } from './auth-flow.service'

describe('FlowController', () => {
  let controller: AuthFlowController

  beforeEach(async () => {
    const FlowServiceMockProvider = {
      provide: FlowService,
      useValue: {},
    }
    const AuthFlowServiceMockProvider = {
      provide: AuthFlowService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthFlowController],
      providers: [AuthFlowServiceMockProvider, FlowServiceMockProvider],
    }).compile()

    controller = module.get<AuthFlowController>(AuthFlowController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
