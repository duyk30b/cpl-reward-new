import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { GridTradingModule } from '@lib/grpc-client/grid-trading/grid-trading.module'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiGridTradingController } from './api-grid-trading.controller'

@Module({
  imports: [
    GridTradingModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiGridTradingController],
})
export class ApiGridTradingModule {}
