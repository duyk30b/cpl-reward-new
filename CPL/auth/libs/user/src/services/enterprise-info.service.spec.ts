import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { EnterpriseInfo } from '../entities/enterprise-info.entity'
import { EnterpriseInfoService } from './enterprise-info.service'

describe('EnterpriseInfoService', () => {
  let service: EnterpriseInfoService

  beforeEach(async () => {
    const EnterpriseInfoRepositoryProvider =
      createMockRepositoryProvider(EnterpriseInfo)
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterpriseInfoService, EnterpriseInfoRepositoryProvider],
    }).compile()

    service = module.get<EnterpriseInfoService>(EnterpriseInfoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
