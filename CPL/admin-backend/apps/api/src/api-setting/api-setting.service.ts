import { Injectable } from '@nestjs/common'
import { SettingService } from '@lib/grpc-client/setting/setting.service'

@Injectable()
export class ApiSettingService {
  constructor(private readonly settingService: SettingService) {}

  async getCountryCodeSetting() {
    return await this.settingService.getCountryCodeSetting()
  }
}
