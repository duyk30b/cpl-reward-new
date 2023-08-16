import { Module } from '@nestjs/common'
import { ApiExchangeSettingController } from './api-exchange-setting.controller'
import { ExchangeSettingModule } from '@lib/grpc-client/exchange-setting/exchange-setting.module'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [
    ExchangeSettingModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiExchangeSettingController],
})
export class ApiExchangeSettingModule {}
