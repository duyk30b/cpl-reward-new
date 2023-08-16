import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { UserTradingController } from './user-trading.controller'
import { UserTradingService } from './user-trading.service'
import { GrpcUserTradingModule } from '@lib/grpc-client/bo/user-trading/user-trading.module'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcUserTradingModule,
  ],
  controllers: [UserTradingController],
  providers: [UserTradingService],
})
export class UserTradingModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOTradingController)
  }
}
