import { Test, TestingModule } from '@nestjs/testing'
import { AuthLoginHistoryService } from './auth-login-history.service'

describe('AuthLoginHistoryService', () => {
  let service: AuthLoginHistoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthLoginHistoryService],
    }).compile()

    service = module.get<AuthLoginHistoryService>(AuthLoginHistoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
