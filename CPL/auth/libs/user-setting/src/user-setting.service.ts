import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class UserSettingService {
  private readonly logger = new Logger(UserSettingService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getLocale(userId: string) {
    const getLocaleUrl = `${this.configService.get(
      'bce_url',
    )}/api/internal/users/locale`

    try {
      const res = await lastValueFrom(
        this.httpService.get(getLocaleUrl, {
          params: {
            internal_secret: this.configService.get('internal_secret'),
            user_id: userId,
          },
        }),
      )
      const lang = res?.data?.data || 'en'
      return lang
    } catch (e) {
      this.logger.log(e)
      this.logger.log(e.stack)
      return 'en'
    }
  }

  async setLocale(userId: string, lang: string) {
    if (!lang) return
    const setLocaleUrl = `${this.configService.get(
      'bce_url',
    )}/api/internal/users/locale`

    try {
      await lastValueFrom(
        this.httpService.post(setLocaleUrl, {
          internal_secret: this.configService.get('internal_secret'),
          user_id: userId,
          lang: lang,
        }),
      )
    } catch (e) {
      this.logger.error(e, e.stack)
    }
  }
}
