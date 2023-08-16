import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { EnterpriseInfoHistory } from '../entities/enterprise-info-history.entity'
import { EnterpriseInfoHistoryService } from './enterprise-info-history.service'

describe('EnterpriseInfoHistoryService', () => {
  let service: EnterpriseInfoHistoryService

  beforeEach(async () => {
    const EnterpriseInfoRepositoryProvider = createMockRepositoryProvider(
      EnterpriseInfoHistory,
    )
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterpriseInfoHistoryService,
        EnterpriseInfoRepositoryProvider,
      ],
    }).compile()

    service = module.get<EnterpriseInfoHistoryService>(
      EnterpriseInfoHistoryService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
