import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { UserGrantPayoutController } from './user-grant-payout.controller'
import { UserGrantPayoutService } from './user-grant-payout.service'
import { GrpcUserGrantPayoutModule } from '@lib/grpc-client/bo/user-grant-payout/user-grant-payout.module'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcUserGrantPayoutModule,
  ],
  controllers: [UserGrantPayoutController],
  providers: [UserGrantPayoutService],
})
export class UserGrantPayoutModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOUnlimitedUserController)
  }
}
