import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import {
  IAuthSettingService,
  IGetCountryByCodeRequest,
  IGetCountryByIdRequest,
} from './auth-setting.interface'

@Injectable()
export class AuthSettingService {
  private authSettingService: IAuthSettingService
  constructor(@Inject('AUTH_SETTING_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authSettingService = this.client.getService<IAuthSettingService>(
      'GAuthSettingService',
    )
  }

  async getAllCountry() {
    const req = await lastValueFrom(this.authSettingService.getAllCountry({}))
    return req.data
  }

  async getCountryByCode(getCountryByCodeRequest: IGetCountryByCodeRequest) {
    return await firstValueFrom(
      this.authSettingService.getCountryByCode(getCountryByCodeRequest),
    )
  }

  async getCountryById(getCountryByIdRequest: IGetCountryByIdRequest) {
    return await firstValueFrom(
      this.authSettingService.getCountryById(getCountryByIdRequest),
    )
  }
}
