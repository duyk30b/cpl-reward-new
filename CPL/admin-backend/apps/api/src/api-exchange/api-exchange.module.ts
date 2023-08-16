import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { ExchangeModule } from '@lib/grpc-client/exchange/exchange.module'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiExchangeController } from './api-exchange.controller'

@Module({
  imports: [
    ExchangeModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
  ],
  providers: [],
  controllers: [ApiExchangeController],
})
export class ApiExchangeModule {}
