import { Test, TestingModule } from '@nestjs/testing'
import { ErrorSyncUserService } from './error-sync-user.service'

describe('ErrorSyncUserService', () => {
  let service: ErrorSyncUserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorSyncUserService],
    }).compile()

    service = module.get<ErrorSyncUserService>(ErrorSyncUserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
