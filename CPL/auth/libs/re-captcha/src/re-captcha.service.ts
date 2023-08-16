import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaNetwork, ReCaptchaType } from '../src/re-captcha.enum'
import { lastValueFrom, map, Observable } from 'rxjs'
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces'
import { RedisService } from '@lib/redis'
import { BusinessException, CaptchaError } from '@lib/util'

@Injectable()
export class ReCaptchaService {
  constructor(
    private readonly redisService: RedisService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private static getRedisCacheReCaptcha(deviceHash: string) {
    return `cache_recaptcha:${deviceHash}`
  }

  async validateCaptcha(
    captcha: string,
    captchaType: string,
    deviceHash: string,
  ): Promise<boolean> {
    if (this.configService.get('recaptcha.enabled') != 1) {
      return true
    }

    const cacheCaptchaResponse = await this.redisService.get(
      ReCaptchaService.getRedisCacheReCaptcha(deviceHash),
    )
    if (cacheCaptchaResponse !== null && cacheCaptchaResponse === captcha) {
      return true
    }

    const SECRET_KEY = this.detectTypeOfCaptcha(captchaType)
    const verifyUrl = `${GoogleRecaptchaNetwork.Google}?secret=${SECRET_KEY}&response=${captcha}`
    try {
      const data = await lastValueFrom(
        this.validateGoogle(verifyUrl).pipe(map((resp) => resp.data)),
      )
      if (data && data.success) {
        const ttl = this.configService.get<number>('recaptcha.cacheTtl')
        await this.redisService.set(
          ReCaptchaService.getRedisCacheReCaptcha(deviceHash),
          captcha,
          ttl,
        )
        return true
      } else {
        throw new BusinessException(CaptchaError.INVALID)
      }
    } catch (error) {
      throw new BusinessException(CaptchaError.INVALID)
    }
  }

  private detectTypeOfCaptcha(captchaType: string) {
    if (captchaType === ReCaptchaType.V2_ANDROID) {
      return this.configService.get('recaptcha.secretV2Android')
    }
    if (captchaType === ReCaptchaType.V2_INVISIBLE) {
      return this.configService.get('recaptcha.secretV2Invisible')
    }
    return this.configService.get('recaptcha.secretV3')
  }

  private validateGoogle(verifyUrl: string): Observable<AxiosResponse<any>> {
    return this.httpService.post(
      verifyUrl,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    )
  }
}
