import { Inject, Injectable } from '@nestjs/common'
import { IGrpcSettingService, ICountryCodeSetting } from './setting.interface'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { plainToClass } from 'class-transformer'
import { CountryCodeSettingDto } from './setting.dto'

@Injectable()
export class SettingService {
  private gSettingService: IGrpcSettingService

  constructor(@Inject('SETTING_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gSettingService = this.client.getService<IGrpcSettingService>(
      'GAuthSettingService',
    )
  }

  async getCountryCodeSetting(): Promise<ICountryCodeSetting> {
    const data = await lastValueFrom(this.gSettingService.getAllCountry({}))

    return plainToClass(CountryCodeSettingDto, data, { ignoreDecorators: true })
  }
}
