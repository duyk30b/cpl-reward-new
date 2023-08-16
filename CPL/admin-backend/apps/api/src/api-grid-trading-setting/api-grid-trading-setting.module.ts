import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { GridTradingSettingModule } from '@lib/grpc-client/grid-trading-setting/grid-trading-setting.module'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiGridTradingSettingController } from './api-grid-trading-setting.controller'

@Module({
  imports: [
    GridTradingSettingModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiGridTradingSettingController],
})
export class ApiGridTradingSettingModule {}
