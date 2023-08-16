import { Test, TestingModule } from '@nestjs/testing'
import { ReCaptchaService } from './re-captcha.service'

describe('ReCaptchaService', () => {
  let service: ReCaptchaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReCaptchaService],
    }).compile()

    service = module.get<ReCaptchaService>(ReCaptchaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
