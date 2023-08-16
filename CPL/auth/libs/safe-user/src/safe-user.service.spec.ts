import { Test, TestingModule } from '@nestjs/testing'
import { SafeUserService } from './safe-user.service'

describe('SafeUserService', () => {
  let service: SafeUserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SafeUserService],
    }).compile()

    service = module.get<SafeUserService>(SafeUserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
