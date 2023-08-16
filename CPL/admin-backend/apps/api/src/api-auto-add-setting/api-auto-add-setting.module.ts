import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiAutoAddSettingController } from './api-auto-add-setting.controller'
import { AutoAddSettingModule } from '@lib/grpc-client/common-setting/auto-add-setting/auto-add-setting.module'
import { ExternalBceModule } from '@lib/external-bce'
import { ApiAutoAddSettingService } from './api-auto-add-setting.service'
import { HotWalletModule } from '@lib/grpc-client/hot-wallet/hot-wallet.module'

@Module({
  imports: [
    AbilityModule,
    AutoAddSettingModule,
    ExternalBceModule,
    HotWalletModule,
  ],
  controllers: [ApiAutoAddSettingController],
  providers: [ApiAutoAddSettingService],
})
export class ApiAutoAddSettingModule {}
