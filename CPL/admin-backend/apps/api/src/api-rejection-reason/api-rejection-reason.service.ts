import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class ApiRejectionReasonService {
  private logger = new Logger(ApiRejectionReasonService.name)
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getAllReasonCategories() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.configService.get(
            'global.bce_admin_url',
          )}/api/internal/reason-categories`,
          {
            params: {
              internal_secret: this.configService.get(
                'global.bce_admin_internal_secret',
              ),
              no_pagination: 1,
            },
          },
        ),
      )
      return response.data.data
    } catch (e) {
      this.logger.error(e)
    }
  }
}
