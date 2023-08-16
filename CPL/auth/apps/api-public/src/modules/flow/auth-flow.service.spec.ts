import { Test, TestingModule } from '@nestjs/testing'
import { FlowService } from '@lib/flows'
import { FileService } from '@lib/upload-file'
import { UploadFileService } from '@lib/upload-file'
import { AuthFlowService } from './auth-flow.service'

describe('FlowService', () => {
  let service: AuthFlowService

  beforeEach(async () => {
    const FlowServiceMockProvider = {
      provide: FlowService,
      useValue: {},
    }
    const FileServiceMockProvider = {
      provide: FileService,
      useValue: {},
    }
    const UploadFileServiceMockProvider = {
      provide: UploadFileService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFlowService,
        FlowServiceMockProvider,
        FileServiceMockProvider,
        UploadFileServiceMockProvider,
      ],
    }).compile()

    service = module.get<AuthFlowService>(AuthFlowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
