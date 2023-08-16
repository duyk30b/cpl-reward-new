import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { UserBalanceController } from './user-balance.controller'
import { UserBalanceService } from './user-balance.service'
import { GrpcUserBalanceModule } from '@lib/grpc-client/bo/user-balance/user-balance.module'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
    GrpcUserBalanceModule,
  ],
  controllers: [UserBalanceController],
  providers: [UserBalanceService],
})
export class UserBalanceModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOTradingController)
  }
}
