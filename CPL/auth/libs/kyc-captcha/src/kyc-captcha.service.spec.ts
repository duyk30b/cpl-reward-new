import { Test, TestingModule } from '@nestjs/testing'
import { KycCaptchaService } from './kyc-captcha.service'

describe('KycCaptchaService', () => {
  let service: KycCaptchaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KycCaptchaService],
    }).compile()

    service = module.get<KycCaptchaService>(KycCaptchaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
