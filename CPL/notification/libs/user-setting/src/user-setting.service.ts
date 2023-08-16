import { DEFAULT_LANG, isSupportedLang } from '@libs/common'
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
      'global.bce_url',
    )}/api/internal/users/locale`

    try {
      const res = await lastValueFrom(
        this.httpService.get(getLocaleUrl, {
          params: {
            internal_secret: this.configService.get(
              'global.bce_internal_secret',
            ),
            user_id: userId,
          },
        }),
      )
      let lang = res?.data?.data
      if (!isSupportedLang(lang)) lang = DEFAULT_LANG
      return lang
    } catch (e) {
      this.logger.error(e, e.stack)
      return DEFAULT_LANG
    }
  }
}
