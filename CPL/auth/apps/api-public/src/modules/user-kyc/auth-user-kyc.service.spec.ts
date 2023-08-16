import { Test, TestingModule } from '@nestjs/testing'
import { FileService } from '@lib/upload-file'
import { UploadFileService } from '@lib/upload-file'
import { UserInfoService } from '@lib/user'
import { EnterpriseInfoService } from '@lib/user'
import { UserService } from '@lib/user'
import { UserInfoServiceMock } from 'apps/test/mock/common/user-info.service.mock'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { AuthUserKycService } from './auth-user-kyc.service'
import { ConfigModule } from '@nestjs/config'
import liveness from 'config/liveness'
import { HttpService } from '@nestjs/axios'
import { EnterpriseInfoHistoryService } from '@lib/user'
import { FlowService } from '@lib/flows'
import { FlowServiceMock } from 'apps/test/mock/common/flow.service.mock'
import { AresService } from '@lib/ares'
import { UserKycHistoryService, UserKycService } from '@lib/user-kyc'

describe('AuthUserKycService', () => {
  let service: AuthUserKycService

  beforeEach(async () => {
    const FlowServiceProvider = {
      provide: FlowService,
      useClass: FlowServiceMock,
    }
    const UserInfoServiceProvider = {
      provide: UserInfoService,
      useClass: UserInfoServiceMock,
    }
    const UserKycServiceProvider = {
      provide: UserKycService,
      useValue: {},
    }
    const UserKycHistoryServiceProvider = {
      provide: UserKycHistoryService,
      useValue: {},
    }
    const EnterpriseInfoServiceProvider = {
      provide: EnterpriseInfoService,
      useValue: {},
    }
    const EnterpriseInfoHistoryServiceProvider = {
      provide: EnterpriseInfoHistoryService,
      useValue: {},
    }
    const UploadFileServiceProvider = {
      provide: UploadFileService,
      useValue: {},
    }
    const FileServiceProvider = {
      provide: FileService,
      useValue: {},
    }
    const UserServiceMockProvider = {
      provide: UserService,
      useClass: UsersServiceMock,
    }
    const HttpServiceMockProvider = {
      provide: HttpService,
      useValue: {},
    }
    const AresServiceMockProvider = {
      provide: AresService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [liveness] })],
      providers: [
        AuthUserKycService,
        UserInfoServiceProvider,
        UserKycServiceProvider,
        UserKycHistoryServiceProvider,
        UploadFileServiceProvider,
        UserServiceMockProvider,
        EnterpriseInfoServiceProvider,
        EnterpriseInfoHistoryServiceProvider,
        FileServiceProvider,
        HttpServiceMockProvider,
        FlowServiceProvider,
        AresServiceMockProvider,
      ],
    }).compile()

    service = module.get<AuthUserKycService>(AuthUserKycService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
