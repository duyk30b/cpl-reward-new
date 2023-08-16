import { Injectable, NestMiddleware } from '@nestjs/common'
import { IRequestWithRecaptcha } from '../interfaces/request-with-recaptcha'
import { ReCaptchaService } from '@lib/re-captcha'

@Injectable()
export class ValidateRecaptchaMiddleware implements NestMiddleware {
  constructor(private readonly reCaptchaService: ReCaptchaService) {}

  async use(req: IRequestWithRecaptcha, res: Response, next: () => void) {
    const reCaptcha = req.header('recaptcha') || req.body.recaptcha
    const reCaptchaType = req.header('x-re-captcha-type') || undefined
    const deviceHash = req.header('device_hash') || undefined
    await this.reCaptchaService.validateCaptcha(
      reCaptcha,
      reCaptchaType,
      deviceHash,
    )
    next()
  }
}
